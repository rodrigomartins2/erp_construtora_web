import { Injectable, Type, inject } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonProp } from '../components/@types/button.model';
import { DialogContext } from './context/dialog-context';
import { DialogFooterComponent } from './dialog-templates/dialog-footer/dialog-footer.component';
import { DialogHeaderComponent } from './dialog-templates/dialog-header/dialog-header.component';

export enum ModalSize {
  MM = '30vw',
  SM = '50vw',
  MD = '75vw',
  LG = '85vw',
  XL = '95vw',
  FULL = '100vw',
}

export type DialogModalProps<TData = unknown> = Omit<
  DynamicDialogConfig<TData>,
  'data' | 'templates'
> & {
  title: string;
  data?: TData;
  subtext?: string;
  icon?: string;
  iconType?: 'prime' | 'material';
  tagText?: string;
  footerButtons?: ButtonProp[];
  showFooter?: boolean;
  closeOnFooterAction?: boolean;
};

export type DialogModalRef<T = unknown> = DynamicDialogRef<T> & {
  dialogContext: DialogContext;
};

@Injectable({
  providedIn: 'root',
})
export class DialogModalService {
  private readonly dialogService = inject(DialogService);

  open<TComponent, TData = unknown>(
    component: Type<TComponent>,
    props: DialogModalProps<TData>,
  ): DialogModalRef<TComponent> {
    const dialogContext = this.createContext(props);
    const ref = this.dialogService.open(component, {
      ...props,
      width: props.width ?? ModalSize.LG,
      breakpoints: props.breakpoints ?? {
        '960px': '90vw',
        '640px': '96vw',
      },
      modal: props.modal ?? true,
      draggable: props.draggable ?? false,
      resizable: props.resizable ?? false,
      closable: props.closable ?? false,
      styleClass: ['app-dialog-modal', props.styleClass].filter(Boolean).join(' '),
      templates: {
        header: DialogHeaderComponent,
        footer: DialogFooterComponent,
      },
      data: {
        ...(props.data as object),
        dialogContext,
        closeOnFooterAction: props.closeOnFooterAction,
      },
    } as DynamicDialogConfig);

    if (!ref) {
      throw new Error('Nao foi possivel abrir a modal.');
    }

    return Object.assign(ref, { dialogContext });
  }

  private createContext(props: DialogModalProps): DialogContext {
    const context = new DialogContext();

    context.title.set(props.title);
    context.subtext.set(props.subtext);
    context.icon.set(props.icon);
    context.iconType.set(props.iconType ?? 'prime');
    context.tagText.set(props.tagText);
    context.footerButtons.set(props.footerButtons ?? []);
    context.showFooter.set(props.showFooter ?? true);

    return context;
  }
}
