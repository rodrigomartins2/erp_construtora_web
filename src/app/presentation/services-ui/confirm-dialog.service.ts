import { inject, Injectable } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonProp } from '../components/@types/button.model';
import { ModalSize } from './dialog-modal.service';
import { ConfirmDialogBodyTemplateComponent } from './dialog-templates/confirm-dialog-templates/confirm-dialog-body-template.component';
import { ConfirmDialogHeaderTemplateComponent } from './dialog-templates/confirm-dialog-templates/confirm-dialog-header-template.component';

export type ConfirmProps = {
  content: string;
  title: string;
  buttons: ButtonProp[];
  cancelAction?: () => void;
  cancelLabel?: string;
  hideCancelButton?: boolean;
  styleClass?: string;
  width?: string;
  breakpoints?: Record<string, string>;
};

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialogService = inject(DialogService);

  open(props: ConfirmProps): DynamicDialogRef {
    const config: DynamicDialogConfig = {
      styleClass: `app-confirm-dialog ${props.styleClass ?? ''}`.trim(),
      width: props.width ?? ModalSize.SM,
      breakpoints: props.breakpoints ?? { '768px': '92vw' },
      templates: {
        header: ConfirmDialogHeaderTemplateComponent,
      },
      data: {
        ...props,
      },
      closable: false,
      draggable: false,
      resizable: false,
      modal: true,
    };
    const ref = this.dialogService.open(ConfirmDialogBodyTemplateComponent, config);

    if (!ref) {
      throw new Error('Não foi possível abrir o diálogo de confirmação.');
    }

    return ref;
  }
}
