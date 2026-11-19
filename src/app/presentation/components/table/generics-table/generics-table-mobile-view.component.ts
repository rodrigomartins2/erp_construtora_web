import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import type { PaginatorState } from 'primeng/paginator';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { GenericsTableAction, GenericsTableColumn } from './generics-table.models';

@Component({
  selector: 'app-generics-table-mobile-view',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, ButtonModule, PaginatorModule, SkeletonModule],
  templateUrl: './generics-table-mobile-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericsTableMobileViewComponent<T> {
  @Input({ required: true }) columns: GenericsTableColumn<T>[] = [];
  @Input({ required: true }) mobilePageData: T[] = [];
  @Input() actions: GenericsTableAction<T>[] = [];
  @Input() paginator = true;
  @Input() alwaysShowPaginator = false;
  @Input() first = 0;
  @Input() rows = 10;
  @Input() totalRecords = 0;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  @Input() loading = false;
  @Input() showCurrentPageReport = true;
  @Input() sortField?: keyof T & string;
  @Input() sortOrder: 1 | -1 = 1;
  @Input() sortableColumns: GenericsTableColumn<T>[] = [];
  @Input() hasActions = false;
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() currentPageReport = 'Exibindo 0 de 0 itens';

  @Input() getDisplayValue = (_row: T, _column: GenericsTableColumn<T>): string => '';
  @Input() getBadgeClass = (_row: T, _column: GenericsTableColumn<T>): string => '';
  @Input() getVisibleActions = (_row: T): GenericsTableAction<T>[] => [];
  @Input() isActionDisabled = (_action: GenericsTableAction<T>, _row: T): boolean => false;
  @Input() getActionTooltip = (_action: GenericsTableAction<T>): string | undefined => undefined;
  @Input() runAction = (_event: Event, _action: GenericsTableAction<T>, _row: T): void => {};
  @Input() getCardTitle = (_row: T): string => 'Registro';

  getActionButtonClass(action: GenericsTableAction<T>): string {
    return ['generics-table-action-button', action.styleClass || ''].filter(Boolean).join(' ');
  }

  get showPaginator(): boolean {
    return this.paginator && (this.alwaysShowPaginator || this.totalRecords > this.rows);
  }

  get totalPages(): number {
    if (this.rows <= 0) {
      return 0;
    }

    return Math.max(1, Math.ceil(this.totalRecords / this.rows));
  }

  get currentPage(): number {
    if (this.rows <= 0) {
      return 1;
    }

    return Math.floor(this.first / this.rows) + 1;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get visiblePageNumbers(): number[] {
    const totalPages = this.totalPages;

    if (totalPages <= 5) {
      return this.pageNumbers;
    }

    const start = Math.max(1, this.currentPage - 1);
    const end = Math.min(totalPages, start + 2);
    const adjustedStart = Math.max(1, end - 2);

    const numbers: number[] = [];
    for (let page = adjustedStart; page <= end; page += 1) {
      numbers.push(page);
    }

    return numbers;
  }

  get showLeadingEllipsis(): boolean {
    return this.totalPages > 5 && this.currentPage > 3;
  }

  get showTrailingEllipsis(): boolean {
    return this.totalPages > 5 && this.currentPage < this.totalPages - 2;
  }

  get canGoPrev(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  onRowsPerPageChange(value: string): void {
    const nextRows = Number(value);

    if (!Number.isFinite(nextRows) || nextRows <= 0 || nextRows === this.rows) {
      return;
    }

    this.pageChange.emit({ first: 0, rows: nextRows } as PaginatorState);
  }

  goToPage(page: number): void {
    if (this.rows <= 0 || this.totalPages === 0) {
      return;
    }

    const nextPage = Math.min(Math.max(page, 1), this.totalPages);

    if (nextPage === this.currentPage) {
      return;
    }

    this.pageChange.emit({
      first: (nextPage - 1) * this.rows,
      rows: this.rows,
    } as PaginatorState);
  }

  goToPreviousPage(): void {
    if (!this.canGoPrev) {
      return;
    }

    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    if (!this.canGoNext) {
      return;
    }

    this.goToPage(this.currentPage + 1);
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  @Output() sortFieldChange = new EventEmitter<string>();
  @Output() sortOrderToggle = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<PaginatorState>();

  trackByColumn(_: number, column: GenericsTableColumn<T>): string {
    return column.field;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
