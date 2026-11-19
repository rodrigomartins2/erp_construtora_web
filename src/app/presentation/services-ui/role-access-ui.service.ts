import { Injectable } from '@angular/core';

import { SessionFacade } from '../../application/facade/session.facade';
import { ToastMessageService } from './toast-message.service';

@Injectable({ providedIn: 'root' })
export class RoleAccessUiService {
  constructor(
    private readonly sessionFacade: SessionFacade,
    private readonly toastMessageService: ToastMessageService,
  ) {}

  hasRole(role: string): boolean {
    return this.sessionFacade.hasRole(role);
  }

  requireRole(role: string): boolean {
    if (this.hasRole(role)) {
      return true;
    }

    this.toastMessageService.add({
      severity: 'warn',
      summary: 'Acesso negado',
      detail: 'Você não tem permissão para executar esta ação.',
    });
    return false;
  }

  guardedAction(role: string, action: () => void): (() => void) | null {
    return this.hasRole(role)
      ? () => {
          if (this.requireRole(role)) {
            action();
          }
        }
      : null;
  }
}
