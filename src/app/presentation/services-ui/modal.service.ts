import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Injectable, TemplateRef, Type, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Opções aceitas por ModalService.show (compatível com as opções usadas antes no ngx-bootstrap). */
export interface ModalOptions<T = any> {
  /** Valores atribuídos à instância do componente aberto. */
  initialState?: Partial<T> & Record<string, any>;
  /** Classes de tamanho: 'modal-sm' | 'modal-lg' | 'modal-xl' (demais classes são ignoradas). */
  class?: string;
  /** Largura explícita (ex.: '600px'). Tem precedência sobre `class`. */
  width?: string;
  /** false = não fecha com ESC. */
  keyboard?: boolean;
  /** true = clique fora não fecha o modal. */
  ignoreBackdropClick?: boolean;
  backdrop?: boolean | 'static';
  animated?: boolean;
  id?: string | number;
}

/** Referência ao modal aberto. Pode ser injetada no componente exibido. */
export class ModalRef<T = any> {
  content?: T;
  readonly onHidden = new Subject<any>();
  /** @internal */
  _dialogRef?: DialogRef<any, any>;

  hide(result?: any): void {
    this._dialogRef?.close(result);
  }
}

const SIZE_WIDTH: Record<string, string> = {
  'modal-sm': '360px',
  'modal-md': '520px',
  'modal-lg': '820px',
  'modal-xl': '1140px'
};

/**
 * Serviço de modais baseado em @angular/cdk/dialog.
 * Substitui o BsModalService do ngx-bootstrap mantendo uma API equivalente
 * (show/hide/onShown/onHidden, initialState e content).
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(Dialog);
  private readonly abertos: ModalRef[] = [];

  private readonly shown = new Subject<ModalRef>();
  private readonly hidden = new Subject<ModalRef>();

  /** Emite quando um modal é aberto. */
  readonly onShown: Observable<ModalRef> = this.shown.asObservable();
  /** Emite quando um modal é fechado. */
  readonly onHidden: Observable<ModalRef> = this.hidden.asObservable();

  show<T = any>(content: Type<T> | TemplateRef<any>, config: ModalOptions<T> = {}): ModalRef<T> {
    const modalRef = new ModalRef<T>();
    const naoFechaFora = config.ignoreBackdropClick ?? config.backdrop === 'static';
    const naoFechaEsc = config.keyboard === false;

    const dialogRef = this.dialog.open<any, any, any>(content as any, {
      width: config.width ?? this.larguraPorClasse(config.class),
      maxWidth: 'calc(100vw - 2rem)',
      panelClass: 'app-modal-panel',
      backdropClass: 'app-modal-backdrop',
      hasBackdrop: config.backdrop !== false,
      disableClose: naoFechaFora || naoFechaEsc,
      autoFocus: false,
      restoreFocus: true,
      providers: [{ provide: ModalRef, useValue: modalRef }]
    });

    modalRef._dialogRef = dialogRef;

    if (dialogRef.componentInstance) {
      modalRef.content = dialogRef.componentInstance as T;
      if (config.initialState) {
        Object.assign(dialogRef.componentInstance, config.initialState);
      }
      // Executa o ngOnInit já aqui, para o componente estar pronto (inscrições feitas)
      // quando show() retornar ou quando onShown for emitido.
      dialogRef.componentRef?.changeDetectorRef.detectChanges();
    }

    // ESC fecha quando permitido, mesmo com clique fora bloqueado.
    if (naoFechaFora && !naoFechaEsc) {
      dialogRef.keydownEvents.subscribe((event) => {
        if (event.key === 'Escape') {
          dialogRef.close();
        }
      });
    }

    this.abertos.push(modalRef);
    dialogRef.closed.subscribe((result) => {
      const idx = this.abertos.indexOf(modalRef);
      if (idx >= 0) {
        this.abertos.splice(idx, 1);
      }
      modalRef.onHidden.next(result);
      modalRef.onHidden.complete();
      this.hidden.next(modalRef);
    });

    queueMicrotask(() => this.shown.next(modalRef));
    return modalRef;
  }

  /** Fecha o último modal aberto. */
  hide(): void {
    this.abertos[this.abertos.length - 1]?.hide();
  }

  /** Fecha todos os modais abertos. */
  hideAll(): void {
    [...this.abertos].forEach((m) => m.hide());
  }

  private larguraPorClasse(classes?: string): string {
    const tamanho = (classes ?? '').split(/\s+/).find((c) => SIZE_WIDTH[c]);
    return tamanho ? SIZE_WIDTH[tamanho] : SIZE_WIDTH['modal-md'];
  }
}
