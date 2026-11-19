import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-dialog-header-template',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex w-full touch-none cursor-grab items-start justify-between gap-4 active:cursor-grabbing"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
    >
      <h1 class="m-0 text-lg font-semibold leading-tight text-(--indigo-801)">{{ title }}</h1>
    </div>
  `,
  styles: `
    :host {
      width: 100%;
    }
    ::ng-deep {
      .p-dialog-header {
        border-radius: 1rem 1rem 0 0;
      }
    }
  `,
})
export class ConfirmDialogHeaderTemplateComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);
  readonly title: string = this.config.data.title;
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
