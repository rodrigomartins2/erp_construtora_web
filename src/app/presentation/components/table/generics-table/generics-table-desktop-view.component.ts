import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import type { PaginatorState } from 'primeng/paginator';
import { PaginatorModule } from 'primeng/paginator';
import type { SortEvent } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {
  GenericsTableAction,
  GenericsTableColumn,
  GenericsTableColumnAlign,
} from './generics-table.models';

@Component({
  selector: 'app-generics-table-desktop-view',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    TableModule,
    ButtonModule,
    PaginatorModule,
    SkeletonModule,
    TooltipModule,
  ],
  templateUrl: './generics-table-desktop-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericsTableDesktopViewComponent<T> {
  @Input({ required: true }) columns: GenericsTableColumn<T>[] = [];
  @Input({ required: true }) sortedData: T[] = [];
  @Input() actions: GenericsTableAction<T>[] = [];
  @Input() paginator = true;
  @Input() alwaysShowPaginator = true;
  @Input() rows = 10;
  @Input() first = 0;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  @Input() loading = false;
  @Input() minWidth = '48rem';
  @Input() totalRecords = 0;
  @Input() lazy = false;
  @Input() sortField?: keyof T & string;
  @Input() sortOrder: 1 | -1 = 1;
  @Input() showCurrentPageReport = true;
  @Input() hasActions = false;
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() currentPageReport = 'Exibindo 0 de 0 itens';

  @Input() isSortable = (column: GenericsTableColumn<T>): boolean => column.sortable !== false;
  @Input() getAlignClass = (align: GenericsTableColumnAlign | undefined): string => {
    if (align === 'right') {
      return 'text-right';
    }

    if (align === 'center') {
      return 'text-center';
    }

    return 'text-left';
  };
  @Input() getJustifyClass = (align: GenericsTableColumnAlign | undefined): string => {
    if (align === 'right') {
      return 'justify-end';
    }

    if (align === 'center') {
      return 'justify-center';
    }

    return 'justify-start';
  };
  @Input() getDisplayValue = (_row: T, _column: GenericsTableColumn<T>): string => '';
  @Input() getBadgeClass = (_row: T, _column: GenericsTableColumn<T>): string => '';
  @Input() getVisibleActions = (_row: T): GenericsTableAction<T>[] => [];
  @Input() isActionDisabled = (_action: GenericsTableAction<T>, _row: T): boolean => false;
  @Input() getActionTooltip = (_action: GenericsTableAction<T>): string | undefined => undefined;
  @Input() runAction = (_event: Event, _action: GenericsTableAction<T>, _row: T): void => {};

  getActionButtonClass(action: GenericsTableAction<T>): string {
    return ['generics-table-action-button', action.styleClass || ''].filter(Boolean).join(' ');
  }

  getActionTooltipPosition(index: number, totalActions: number): 'top' | 'left' {
    return index === totalActions - 1 ? 'left' : 'top';
  }

  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() pageChange = new EventEmitter<PaginatorState>();

  trackByColumn(_: number, column: GenericsTableColumn<T>): string {
    return column.field;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
