import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DialogContext } from '../../context/dialog-context';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="grid w-full min-w-0 touch-none cursor-grab grid-cols-[minmax(0,1fr)_auto] items-start gap-4 active:cursor-grabbing"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
    >
      <div class="flex min-w-0 flex-1 items-start gap-3">
        @if (context.icon()) {
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[#10b981]"
          >
            @if (context.iconType() === 'material') {
              <span class="material-symbols-outlined text-[22px] leading-none">{{
                context.icon()
              }}</span>
            } @else {
              <i [class]="context.icon()"></i>
            }
          </span>
        }

        <div class="flex min-w-0 flex-col gap-0">
          <div class="flex min-w-0 flex-wrap items-center gap-2">
            <h2
              class="m-0 truncate font-headline-lg text-[20px] font-bold leading-6 text-[#0f172a]"
            >
              {{ context.title() }}
            </h2>
          </div>

          @if (context.subtext()) {
            <p class="m-0 font-body-md text-[12px] font-medium leading-4 text-[#334155]">
              {{ context.subtext() }}
            </p>
          }

          @if (context.tagText()) {
            <p
              class="mt-1 inline-block w-fit rounded-full bg-[#e2e8f0] px-2 py-0.5 font-caption-micro text-[11px] font-bold leading-4 text-[#1e293b] uppercase"
            >
              {{ context.tagText() }}
            </p>
          }
        </div>
      </div>

      <p-button
        class="shrink-0 justify-self-end"
        severity="secondary"
        [text]="true"
        [rounded]="true"
        (onClick)="ref.close()"
      >
        <span class="material-symbols-outlined app-button-material-icon">close</span>
      </p-button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class DialogHeaderComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);
  readonly context: DialogContext = this.config.data.dialogContext;
  private touchStartY: number | null = null;
  private touchCurrentY: number | null = null;
  private touchStartHeight = 0;
  private readonly closeDragThreshold = 80;
  private readonly expandDragThreshold = 48;

  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0]?.clientY ?? null;
    this.touchCurrentY = this.touchStartY;
    this.touchStartHeight = this.getDialogHeight();
  }

  onTouchMove(event: TouchEvent): void {
    this.touchCurrentY = event.touches[0]?.clientY ?? this.touchCurrentY;

    if (this.touchStartY === null || this.touchCurrentY === null) {
      return;
    }

    event.preventDefault();

    const deltaY = this.touchCurrentY - this.touchStartY;
    this.setDialogHeight(this.clampDialogHeight(this.touchStartHeight - deltaY));
  }

  onTouchEnd(): void {
    if (this.touchStartY === null || this.touchCurrentY === null) {
      this.resetTouch();
      return;
    }

    const deltaY = this.touchCurrentY - this.touchStartY;

    if (deltaY > this.closeDragThreshold) {
      this.ref.close();
    } else if (deltaY < -this.expandDragThreshold) {
      this.setDialogHeight(window.innerHeight * 0.92);
    } else {
      this.clearDialogHeight();
    }

    this.resetTouch();
  }

  private getDialogElement(): HTMLElement | null {
    return this.elementRef.nativeElement.closest('.p-dialog');
  }

  private getDialogHeight(): number {
    return this.getDialogElement()?.getBoundingClientRect().height ?? window.innerHeight * 0.8;
  }

  private setDialogHeight(height: number): void {
    this.getDialogElement()?.style.setProperty('--app-mobile-sheet-height', `${height}px`);
  }

  private clearDialogHeight(): void {
    this.getDialogElement()?.style.removeProperty('--app-mobile-sheet-height');
  }

  private clampDialogHeight(height: number): number {
    const minHeight = window.innerHeight * 0.42;
    const maxHeight = window.innerHeight * 0.92;

    return Math.min(Math.max(height, minHeight), maxHeight);
  }

  private resetTouch(): void {
    this.touchStartY = null;
    this.touchCurrentY = null;
    this.touchStartHeight = 0;
  }
}
