import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonProp } from '../../../components/@types/button.model';
import { DialogContext } from '../../context/dialog-context';

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  imports: [CommonModule, ButtonModule, SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (context.showFooter()) {
      <div class="flex flex-wrap justify-end gap-2">
        @for (btn of context.footerButtons(); track btn.key ?? $index) {
          @if (btn.showIf !== false) {
            @if (btn.loading) {
              <p-skeleton width="9rem" height="2.25rem" borderRadius="8px" />
            } @else {
              <p-button
                [icon]="btn.iconType !== 'material' ? btn.icon : undefined"
                [label]="btn.iconType !== 'material' ? btn.label : undefined"
                [outlined]="btn.outlined"
                [rounded]="btn.rounded"
                [iconPos]="btn.iconPos || 'left'"
                [title]="btn.altText || btn.label"
                [disabled]="btn.disable || btn.loading"
                [severity]="btn.severity"
                [text]="btn.text"
                [class]="btn.className"
                [style]="btn.style || {}"
                (onClick)="handleAction(btn)"
              >
                @if (!btn.loading && btn.iconType === 'material') {
                  <span class="inline-flex items-center gap-2">
                    @if (btn.iconPos !== 'right' && btn.icon) {
                      <span class="material-symbols-outlined app-button-material-icon">{{
                        btn.icon
                      }}</span>
                    }
                    @if (btn.label) {
                      <span class="p-button-label">{{ btn.label }}</span>
                    }
                    @if (btn.iconPos === 'right' && btn.icon) {
                      <span class="material-symbols-outlined app-button-material-icon">{{
                        btn.icon
                      }}</span>
                    }
                  </span>
                }
              </p-button>
            }
          }
        }
      </div>
    }
  `,
})
export class DialogFooterComponent {
  readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);
  readonly context: DialogContext = this.config.data.dialogContext;

  handleAction(btn: ButtonProp): void {
    btn.action();

    if (this.config.data.closeOnFooterAction !== false) {
      this.ref.close();
    }
  }
}
