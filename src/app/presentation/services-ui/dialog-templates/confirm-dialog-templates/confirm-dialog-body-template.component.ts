import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonProp } from '../../../components/@types/button.model';

@Component({
  selector: 'app-confirm-dialog-body-template',
  standalone: true,
  imports: [ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex w-full flex-column">
      <p
        class="m-0 break-words text-base font-normal leading-[1.625] text-[var(--indigo-801)]"
        [innerHTML]="content"
      ></p>
    </div>
    <div class="confirm-dialog-footer mt-6 flex flex-wrap items-center justify-end gap-2">
      @if (!hideCancelButton) {
        <p-button
          (onClick)="cancelAction(); ref.close()"
          severity="secondary"
          [label]="cancelLabel"
          styleClass="w-full sm:w-auto"
        />
      }
      @for (btn of buttons; track $index) {
        <p-button
          [class]="btn.className"
          (onClick)="btn.action(); ref.close()"
          [icon]="btn.icon"
          [iconPos]="btn.iconPos || 'left'"
          [rounded]="btn.rounded"
          [severity]="btn.severity"
          [outlined]="btn.outlined"
          [label]="btn.label"
          styleClass="w-full sm:w-auto"
        />
      }
    </div>
  `,
  styles: `
    ::ng-deep {
      .p-dialog-content {
        border-radius: 0 0 1rem 1rem;
      }
    }
  `,
})
export class ConfirmDialogBodyTemplateComponent {
  readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);

  readonly content: string = this.config.data.content;
  readonly buttons: ButtonProp[] = this.config.data.buttons;
  readonly cancelLabel: string = this.config.data.cancelLabel || 'Cancelar';
  readonly cancelAction: () => void = this.config.data.cancelAction ?? (() => {});
  readonly hideCancelButton: boolean = this.config.data.hideCancelButton ?? false;
}
