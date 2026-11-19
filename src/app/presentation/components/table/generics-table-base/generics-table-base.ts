import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { SortEvent } from 'primeng/api';

import { Resultado } from '../../../../application/@types/resultado.model';
import { ListagemGeneric } from '../../../../core/models/api-response.models';
import {
  GenericsTableAction,
  GenericsTableColumn,
  GenericsTableColumnAlign,
} from '../generics-table/generics-table.models';
import { GenericsTableBaseMobileComponent } from './mobile-view/generics-table-base-mobile';

@Component({
  selector: 'app-generics-table-base',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgTemplateOutlet,
    TableModule,
    ButtonModule,
    CheckboxModule,
    PaginatorModule,
    SkeletonModule,
    TooltipModule,
    GenericsTableBaseMobileComponent,
  ],
  templateUrl: './generics-table-base.html',
  styleUrl: './generics-table-base.css',
})
export class GenericsTableBaseComponent<T> implements OnInit, OnChanges, OnDestroy {
  @ContentChild('cardTemplate') cardTemplate?: TemplateRef<unknown>;

  @Input({ required: true }) columns: GenericsTableColumn<T>[] = [];
  @Input() data: T[] = [];

  private _fetchMethod?: (
    pageSize: number,
    pageNumber: number,
  ) => Observable<Resultado<T[]> | Resultado<ListagemGeneric<T>>>;

  @Input()
  set fetchMethod(
    value:
      | ((
          pageSize: number,
          pageNumber: number,
        ) => Observable<Resultado<T[]> | Resultado<ListagemGeneric<T>>>)
      | undefined,
  ) {
    this._fetchMethod = value;
    this.remoteLoading = typeof value === 'function';
  }
  get fetchMethod():
    | ((
        pageSize: number,
        pageNumber: number,
      ) => Observable<Resultado<T[]> | Resultado<ListagemGeneric<T>>>)
    | undefined {
    return this._fetchMethod;
  }

  @Input() actions: GenericsTableAction<T>[] = [];
  @Input() rows = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  @Input() loading = false;
  @Input() minWidth = '48rem';
  @Input() paginator = true;
  @Input() alwaysShowPaginator = true;
  @Input() showCurrentPageReport = true;
  @Input() totalRecords?: number;
  @Input() sortField?: keyof T & string;
  @Input() sortOrder: 1 | -1 = 1;
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() cardBreakpoint = 640;
  @Input() viewMode: 'auto' | 'table' | 'card' = 'auto';
  @Input() cardTitleField?: string;
  @Input() freezeActionsColumn = true;
  @Input() selectionEnabled = false;
  @Input() selectionMode: 'single' | 'multiple' | null = null;
  @Input() selectedRows: T[] = [];
  @Input() dataKey?: string;
  @Input() reloadKey?: string | number | boolean | null;

  @Output() pageChange = new EventEmitter<PaginatorState>();
  @Output() sortChange = new EventEmitter<{ field?: keyof T & string; order: 1 | -1 }>();
  @Output() selectionChange = new EventEmitter<T[]>();

  private initialized = false;
  private fetchSubscription?: Subscription;
  private remoteResponseMode: 'all' | 'paged' | null = null;
  private isDestroyed = false;

  first = 0;
  remoteData: T[] = [];
  remoteTotalRecords = 0;
  remoteLoading = false;
  isMobileViewport = false;
  readonly skeletonRowCount = 5;
  private readonly dateFormatter = new Intl.DateTimeFormat('pt-BR');
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkViewport();
  }

  ngOnInit(): void {
    this.initialized = true;
    this.checkViewport();
    if (this.isRemoteMode) {
      this.loadRemoteData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized || !this.isRemoteMode) {
      return;
    }

    if (changes['fetchMethod'] || changes['reloadKey']) {
      this.loadRemoteData(true);
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.fetchSubscription?.unsubscribe();
  }

  private checkViewport(): void {
    this.isMobileViewport = window.innerWidth <= this.cardBreakpoint;
  }

  get isRemoteMode(): boolean {
    return typeof this._fetchMethod === 'function';
  }

  get isRemotePagedMode(): boolean {
    return this.isRemoteMode && this.remoteResponseMode === 'paged';
  }

  get effectiveLoading(): boolean {
    return this.loading || this.remoteLoading;
  }

  get useCardView(): boolean {
    if (this.viewMode === 'card') {
      return true;
    }

    if (this.viewMode === 'table') {
      return false;
    }

    return this.isMobileViewport;
  }

  get tableData(): T[] {
    if (this.isRemoteMode) {
      return this.remoteData;
    }
    return [...this.data];
  }

  get skeletonRows(): T[] {
    return Array.from({ length: this.skeletonRowCount }, () => ({}) as T);
  }

  get totalRecordsCount(): number {
    if (this.isRemotePagedMode) {
      return this.remoteTotalRecords;
    }
    if (this.totalRecords !== undefined) {
      return this.totalRecords;
    }
    return this.tableData.length;
  }

  get hasActions(): boolean {
    return this.actions.length > 0;
  }

  get effectiveSelectionMode(): 'single' | 'multiple' {
    return this.selectionMode ?? 'multiple';
  }

  get isSelectionActive(): boolean {
    return this.selectionEnabled;
  }

  get currentPageRows(): T[] {
    if (this.isRemotePagedMode || !this.paginator) {
      return this.tableData;
    }

    return this.tableData.slice(this.first, this.first + this.rows);
  }

  get allCurrentPageRowsSelected(): boolean {
    const rows = this.currentPageRows;
    return rows.length > 0 && rows.every((row) => this.isRowSelected(row));
  }

  onSort(event: SortEvent): void {
    const field = event.field as keyof T & string;
    const order = event.order === -1 ? -1 : 1;

    this.sortField = field;
    this.sortOrder = order;
    this.sortChange.emit({ field, order });

    if (this.isRemotePagedMode) {
      this.loadRemoteData(true);
    }
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    this.pageChange.emit(event);

    if (this.isRemotePagedMode) {
      this.loadRemoteData();
    }
  }

  private loadRemoteData(resetPage = false): void {
    if (!this.fetchMethod || this.isDestroyed) return;

    if (resetPage) {
      this.first = 0;
    }

    const pageSize = this.rows;
    const pageNumber = Math.floor(this.first / pageSize) + 1;
    this.remoteLoading = true;
    this.fetchSubscription?.unsubscribe();
    this.fetchSubscription = this.fetchMethod(pageSize, pageNumber).subscribe({
      next: (response) => {
        const payload = response.dados;
        if (Array.isArray(payload)) {
          this.remoteResponseMode = 'all';
          this.remoteData = payload;
          this.remoteTotalRecords = payload.length;
        } else if (payload && typeof payload === 'object' && 'result' in payload) {
          this.remoteResponseMode = 'paged';
          const result = payload as ListagemGeneric<T>;
          this.remoteData = result.result ?? [];
          this.remoteTotalRecords = result.total ?? this.remoteData.length;
        }
        this.remoteLoading = false;
      },
      error: () => {
        this.remoteData = [];
        this.remoteTotalRecords = 0;
        this.remoteLoading = false;
      },
    });
  }

  reload(): void {
    if (this.isRemoteMode) {
      this.loadRemoteData(true);
    }
  }

  readonly isRowSelected = (row: T): boolean => {
    const dataKey = this.dataKey;
    if (dataKey) {
      const rowKey = (row as Record<string, unknown>)[dataKey];
      return this.selectedRows.some(
        (selected) => (selected as Record<string, unknown>)[dataKey] === rowKey,
      );
    }

    return this.selectedRows.includes(row);
  };

  readonly toggleRowSelection = (row: T, checked: boolean): void => {
    if (!this.isSelectionActive) return;

    if (this.effectiveSelectionMode === 'single') {
      this.selectionChange.emit(checked ? [row] : []);
      return;
    }

    const next = checked
      ? this.isRowSelected(row)
        ? this.selectedRows
        : [...this.selectedRows, row]
      : this.selectedRows.filter((selected) => this.getRowKey(selected) !== this.getRowKey(row));

    this.selectionChange.emit(next);
  };

  toggleCurrentPageSelection(checked: boolean): void {
    if (!this.isSelectionActive || this.effectiveSelectionMode !== 'multiple') return;

    const pageRows = this.currentPageRows;

    if (checked) {
      const selectedByKey = new Map<unknown, T>(
        this.selectedRows.map((selected) => [this.getRowKey(selected), selected]),
      );

      pageRows.forEach((row) => selectedByKey.set(this.getRowKey(row), row));
      this.selectionChange.emit(Array.from(selectedByKey.values()));
      return;
    }

    const pageKeys = new Set(pageRows.map((row) => this.getRowKey(row)));
    this.selectionChange.emit(
      this.selectedRows.filter((selected) => !pageKeys.has(this.getRowKey(selected))),
    );
  }

  private getRowKey(row: T): unknown {
    const dataKey = this.dataKey;
    if (dataKey) return (row as Record<string, unknown>)[dataKey];
    return row;
  }

  getAlignClass = (align: GenericsTableColumnAlign | undefined): string => {
    if (align === 'right') return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
  };

  getJustifyClass = (align: GenericsTableColumnAlign | undefined): string => {
    if (align === 'right') return 'justify-end';
    if (align === 'center') return 'justify-center';
    return 'justify-start';
  };

  getDisplayValue = (row: T, column: GenericsTableColumn<T>): string => {
    const rawValue = this.getRawValue(row, column.field);
    const value = column.valueTransformFn ? column.valueTransformFn(rawValue, row) : rawValue;
    if (value === null || value === undefined || value === '') return '-';

    if (column.type === 'currency') return this.formatCurrency(value);
    if (column.type === 'date') return this.formatDate(value);

    return String(value);
  };

  getColumnStyle(column: GenericsTableColumn<T>): Record<string, string> {
    const width = column.width || 'auto';

    return {
      width,
      'min-width': width,
      'max-width': width,
    };
  }

  getActionButtonClass(action: GenericsTableAction<T>): string {
    return ['generics-table-action-button', action.styleClass || ''].filter(Boolean).join(' ');
  }

  getBadgeClass(row: T, column: GenericsTableColumn<T>): string {
    const rawValue = this.getRawValue(row, column.field);
    return [column.badgeStyleClass || '', column.badgeClassFn?.(rawValue, row) || '']
      .filter(Boolean)
      .join(' ');
  }

  private getRawValue(row: T, field: keyof T & string): unknown {
    return field
      .split('.')
      .reduce<unknown>(
        (acc, part) =>
          acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined,
        row,
      );
  }

  private formatCurrency(value: unknown): string {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return this.currencyFormatter.format(num);
  }

  private formatDate(value: unknown): string {
    if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) {
      return String(value);
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return this.dateFormatter.format(date);
  }

  getVisibleActions = (row: T): GenericsTableAction<T>[] => {
    return this.actions.filter((action) => !action.showIf || action.showIf(row));
  };

  trackByColumn(index: number): number {
    return index;
  }
}
