import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import {
  GenericsTableFilterModalButton,
  GenericsTableFilterTemplateContext,
} from './generics-table.models';

@Component({
  selector: 'app-generics-table-filter-panel',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, ButtonModule, DialogModule, DrawerModule],
  templateUrl: './generics-table-filter-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericsTableFilterPanelComponent<T> implements OnChanges {
  @Input() showHeader = true;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() isMobileViewport = false;
  @Input() activeFilterText = 'Nenhum filtro aplicado.';
  @Input() hasActiveFilters = false;
  @Input() filterModalTitle = 'Filtros';
  @Input() filterModalSize = 'min(92vw, 34rem)';
  @Input() filterDrawerHeight = '80vh';
  @Input() filterTemplate?: TemplateRef<GenericsTableFilterTemplateContext<T>>;
  @Input() filterTemplateContext!: GenericsTableFilterTemplateContext<T>;
  @Input() cancelFilterButton: GenericsTableFilterModalButton = {
    label: 'Cancelar',
    severity: 'secondary',
    text: true,
  };
  @Input() clearFilterButton: GenericsTableFilterModalButton = {
    label: 'Limpar',
    icon: 'pi pi-filter-slash',
    severity: 'secondary',
    outlined: true,
  };
  @Input() applyFilterButton: GenericsTableFilterModalButton = {
    label: 'Filtrar',
    icon: 'pi pi-check',
  };

  @Output() clearRequested = new EventEmitter<void>();
  @Output() applyRequested = new EventEmitter<void>();

  private touchStartY: number | null = null;
  private touchCurrentY: number | null = null;
  private touchStartHeight = 0;
  private readonly minDrawerHeightRatio = 0.42;
  private readonly expandedDrawerHeightRatio = 0.92;
  private readonly closeDragThreshold = 80;
  private readonly expandDragThreshold = 48;
  mobileDrawerHeight = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterDrawerHeight'] || changes['visible']) {
      this.resetDrawerHeight();
    }
  }

  close(): void {
    this.visibleChange.emit(false);
    this.resetDrawerHeight();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0]?.clientY ?? null;
    this.touchCurrentY = this.touchStartY;
    this.touchStartHeight = this.getDrawerElementHeight(event);
  }

  onTouchMove(event: TouchEvent): void {
    this.touchCurrentY = event.touches[0]?.clientY ?? this.touchCurrentY;

    if (this.touchStartY === null || this.touchCurrentY === null) {
      return;
    }

    event.preventDefault();

    const deltaY = this.touchCurrentY - this.touchStartY;
    const nextHeight = this.clampDrawerHeight(this.touchStartHeight - deltaY);
    this.mobileDrawerHeight = `${nextHeight}px`;
  }

  onTouchEnd(): void {
    if (this.touchStartY === null || this.touchCurrentY === null) {
      this.resetTouch();
      return;
    }

    const deltaY = this.touchCurrentY - this.touchStartY;

    if (deltaY > this.closeDragThreshold) {
      this.close();
    } else if (deltaY < -this.expandDragThreshold) {
      this.expandDrawer();
    } else {
      this.resetDrawerHeight();
    }

    this.resetTouch();
  }

  private expandDrawer(): void {
    this.mobileDrawerHeight = `${Math.round(window.innerHeight * this.expandedDrawerHeightRatio)}px`;
  }

  private resetDrawerHeight(): void {
    this.mobileDrawerHeight = '';
  }

  private getDrawerElementHeight(event: TouchEvent): number {
    const handle = event.currentTarget as HTMLElement | null;
    const sheet = handle?.parentElement;

    return sheet?.getBoundingClientRect().height ?? window.innerHeight * 0.8;
  }

  private clampDrawerHeight(height: number): number {
    const minHeight = window.innerHeight * this.minDrawerHeightRatio;
    const maxHeight = window.innerHeight * this.expandedDrawerHeightRatio;

    return Math.min(Math.max(height, minHeight), maxHeight);
  }

  private resetTouch(): void {
    this.touchStartY = null;
    this.touchCurrentY = null;
    this.touchStartHeight = 0;
  }
}
