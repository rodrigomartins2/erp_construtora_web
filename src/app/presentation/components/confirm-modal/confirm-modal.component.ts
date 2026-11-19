import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Subject } from 'rxjs';
import { ModalRef } from 'src/app/presentation/services-ui/modal.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
  standalone: true,
  imports: [ButtonModule]
})
export class ConfirmModalComponent {
  @Input() titulo!: string;
  @Input() mensagem!: string;
  @Input() submensagem!: string;
  @Input() CancelText: string = 'Cancelar';
  @Input() OkText: string = 'Sim';

  /** Criado na construção para estar disponível logo após ModalService.show(). */
  readonly confirmResult = new Subject<boolean>();

  constructor(private bsModalRef: ModalRef) {}

  onFechar() {
    this.confirmAndClose(false);
  }

  onconfirm() {
    this.confirmAndClose(true);
  }

  private confirmAndClose(value: boolean) {
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }
}
