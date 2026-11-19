import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { ModalOptions, ModalService } from 'src/app/presentation/services-ui/modal.service';
import { AlertModalComponent } from 'src/app/presentation/components/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/presentation/components/confirm-modal/confirm-modal.component';

enum AlertType {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info'
}

enum IconType {
  SUCCESS = 'sucess',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info'
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterRouteChange = false;

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    ignoreBackdropClick: true,
    width: '420px'
  };

  constructor(private router: Router, private modalService: ModalService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clear();
        }
      }
    });
  }

  clear() {
    this.subject.next('');
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'error', text: message });
  }

  showConfirm(titulo: string, mensagem: string, submensagem?: string, cancelText?: string, okText?: string) {
    const initialState: Partial<ConfirmModalComponent> = { titulo, mensagem };

    if (submensagem)
      initialState.submensagem = submensagem;
    if (cancelText)
      initialState.CancelText = cancelText;
    if (okText)
      initialState.OkText = okText;

    const modalRef = this.modalService.show(ConfirmModalComponent, { ...this.config, initialState });
    return modalRef.content!.confirmResult;
  }

  private showAlert(titulo: string, mensagem: string, url: string, codigo: string, type: AlertType, icon: string) {
    this.modalService.show(AlertModalComponent, {
      ...this.config,
      initialState: { titulo, type, icon, mensagem, url, codigo }
    });
  }

  showAlertSuccess(titulo: string, mensagem: string, url: string, codigo: string) {
    this.showAlert(titulo, mensagem, url, codigo, AlertType.SUCCESS, IconType.SUCCESS);
  }

  showAlertDanger(titulo: string, mensagem: string, url: string, codigo: string) {
    this.showAlert(titulo, mensagem, url, codigo, AlertType.DANGER, IconType.DANGER);
  }

  showAlertWarning(titulo: string, mensagem: string, url: string, codigo: string) {
    this.showAlert(titulo, mensagem, url, codigo, AlertType.WARNING, IconType.WARNING);
  }

  showAlertInfo(titulo: string, mensagem: string, url: string, codigo: string) {
    this.showAlert(titulo, mensagem, url, codigo, AlertType.INFO, IconType.INFO);
  }
}
