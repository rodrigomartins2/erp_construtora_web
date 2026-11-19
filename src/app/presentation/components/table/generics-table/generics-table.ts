import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import type { SortEvent } from 'primeng/api';
import type { PaginatorState } from 'primeng/paginator';
import { Observable, Subscription } from 'rxjs';
import { Resultado } from '../../../../application/@types/resultado.model';
import { ListagemGeneric } from '../../../../core/models/api-response.models';
import { GenericsTableDesktopViewComponent } from './generics-table-desktop-view.component';
import { GenericsTableFilterPanelComponent } from './generics-table-filter-panel.component';
import { GenericsTableMobileViewComponent } from './generics-table-mobile-view.component';
import {
  GenericsTableAction,
  GenericsTableColumn,
  GenericsTableColumnAlign,
  GenericsTableColumnType,
  GenericsTableFilterModalButton,
  GenericsTableFilterModalButtons,
  GenericsTableFilterTemplateContext,
  GenericsTableFilterValue,
} from './generics-table.models';

export type {
  GenericsTableAction,
  GenericsTableColumn,
  GenericsTableColumnAlign,
  GenericsTableColumnType,
  GenericsTableFilterModalButton,
  GenericsTableFilterModalButtons,
  GenericsTableFilterTemplateContext,
  GenericsTableFilterValue,
};

@Component({
  selector: 'app-generics-table',
  standalone: true,
  imports: [
    CommonModule,
    GenericsTableFilterPanelComponent,
    GenericsTableDesktopViewComponent,
    GenericsTableMobileViewComponent,
  ],
  templateUrl: './generics-table.html',
  styleUrl: './generics-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericsTable<T, R = Record<string, unknown>>
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  private readonly dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  @ContentChild('filterTemplate') filterTemplate?: TemplateRef<
    GenericsTableFilterTemplateContext<T>
  >;

  @Input({ required: true }) columns: GenericsTableColumn<T>[] = [];
  @Input() data: T[] = [];
  private _fetchMethod?: (
    pageSize: number,
    pageNumber: number,
    filtros?: R,
  ) => Observable<Resultado<T[]> | Resultado<ListagemGeneric<T>>>;
  @Input()
  set fetchMethod(
    value:
      | ((
          pageSize: number,
          pageNumber: number,
          filtros?: R,
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
        filtros?: R,
      ) => Observable<Resultado<T[]> | Resultado<ListagemGeneric<T>>>)
    | undefined {
    return this._fetchMethod;
  }
  @Input() fetchFilters?: R;
  @Input() actions: GenericsTableAction<T>[] = [];
  @Input() rows = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() loading = false;
  @Input() minWidth = '48rem';
  @Input() paginator = true;
  @Input() alwaysShowPaginator = false;
  @Input() showCurrentPageReport = true;
  @Input() showHeader = true;
  @Input() filterLabels: Partial<Record<string, string>> = {};
  @Input() filterModalTitle = 'Filtros';
  @Input() filterModalSize = 'min(92vw, 34rem)';
  @Input() filterDrawerHeight = '80vh';
  @Input() filterModalButtons: GenericsTableFilterModalButtons = {};
  @Input() cardTitleField?: keyof T & string;
  @Input() todosRegistros = false;
  @Input() totalRecords?: number;
  @Input() sortField?: keyof T & string;
  @Input() sortOrder: 1 | -1 = 1;

  @Input()
  set cardBreakpoint(value: number) {
    this._cardBreakpoint = value;
    this.isMobileViewport = this.isViewportWithinCardBreakpoint();
  }

  get cardBreakpoint(): number {
    return this._cardBreakpoint;
  }

  @Output() pageChange = new EventEmitter<PaginatorState>();
  @Output() sortChange = new EventEmitter<{ field?: keyof T & string; order: 1 | -1 }>();
  @Output() filtersChange = new EventEmitter<Partial<Record<string, GenericsTableFilterValue>>>();
  @Output() filtersCleared = new EventEmitter<void>();

  private _cardBreakpoint = 640;
  private initialized = false;
  private viewInitialized = false;
  private initialRemoteLoadQueued = false;
  private isDestroyed = false;
  private lastRemoteRequestKey = '';
  private fetchSubscription?: Subscription;
  private remoteResponseMode: 'all' | 'paged' | null = null;
  @Input() first = 0;
  isMobileViewport = this.isViewportWithinCardBreakpoint();
  filterModalVisible = false;
  filterValues: Partial<Record<string, GenericsTableFilterValue>> = {};
  filterDisplayValues: Partial<Record<string, string>> = {};
  draftFilterValues: Partial<Record<string, GenericsTableFilterValue>> = {};
  draftFilterDisplayValues: Partial<Record<string, string>> = {};
  remoteData: T[] = [];
  remoteTotalRecords = 0;
  remoteLoading = false;

  setDraftFilterValue = (
    field: string,
    value: GenericsTableFilterValue,
    displayValue?: string,
  ): void => {
    this.onDraftFilterValueChange(field, value, displayValue);
  };

  setDraftFilterValues = (
    values: Partial<Record<string, GenericsTableFilterValue>>,
    displayValues: Partial<Record<string, string>> = {},
  ): void => {
    this.draftFilterValues = { ...values };
    this.draftFilterDisplayValues = { ...displayValues };
    this.syncFilterTemplateContext();
    this.changeDetectorRef.markForCheck();
  };

  setAppliedFilterValues = (
    values: Partial<Record<string, GenericsTableFilterValue>>,
    displayValues: Partial<Record<string, string>> = {},
  ): void => {
    this.filterValues = this.sanitizeFilterValues(values);
    this.filterDisplayValues = this.sanitizeFilterDisplayValues(displayValues, this.filterValues);
    this.setDraftFilterValues(this.filterValues, this.filterDisplayValues);
  };

  @HostListener('window:resize')
  onWindowResize(): void {
    this.isMobileViewport = this.isViewportWithinCardBreakpoint();
  }

  ngOnInit(): void {
    this.initialized = true;
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.queueInitialRemoteLoad();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized || !this.isRemoteMode) {
      return;
    }

    if (changes['fetchMethod'] || changes['fetchFilters']) {
      this.queueRemoteLoad(true);
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.fetchSubscription?.unsubscribe();
  }

  get hasActions(): boolean {
    return this.actions.length > 0;
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

  get sortableColumns(): GenericsTableColumn<T>[] {
    return this.columns.filter((column) => this.isSortable(column));
  }

  get cancelFilterButton(): GenericsTableFilterModalButton {
    return {
      label: 'Cancelar',
      severity: 'secondary',
      text: true,
      ...this.filterModalButtons.cancel,
    };
  }

  get clearFilterButton(): GenericsTableFilterModalButton {
    return {
      label: 'Limpar',
      icon: 'pi pi-filter-slash',
      severity: 'secondary',
      outlined: true,
      ...this.filterModalButtons.clear,
    };
  }

  get applyFilterButton(): GenericsTableFilterModalButton {
    return {
      label: 'Filtrar',
      icon: 'pi pi-check',
      ...this.filterModalButtons.apply,
    };
  }

  readonly filterTemplateContext: GenericsTableFilterTemplateContext<T> = {
    $implicit: this.draftFilterValues,
    values: this.draftFilterValues,
    displayValues: this.draftFilterDisplayValues,
    setValue: this.setDraftFilterValue,
    setValues: this.setDraftFilterValues,
  };

  get activeFilterText(): string {
    const activeFilters = this.activeFilters;

    if (activeFilters.length === 0) {
      return 'Nenhum filtro aplicado.';
    }

    return `Filtros: ${activeFilters.map((filter) => `${filter.header}: ${filter.value}`).join(' | ')}`;
  }

  get hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  get activeFilters(): Array<{ field: string; header: string; value: string }> {
    return Object.entries(this.filterValues)
      .map(([field, value]) => ({
        field,
        header: this.getFilterHeader(field),
        value: String(this.filterDisplayValues[field] ?? value ?? '').trim(),
      }))
      .filter((filter) => filter.value.length > 0);
  }

  get filteredData(): T[] {
    if (this.isRemoteMode) {
      return [...this.remoteData];
    }

    return this.getLocalFilteredData();
  }

  private getLocalFilteredData(): T[] {
    const activeFilters = this.activeFilters;

    if (activeFilters.length === 0) {
      return [...this.data];
    }

    return this.data.filter((row) =>
      activeFilters.every((filter) => {
        const column = this.columns.find((item) => item.field === filter.field);
        const value = column
          ? this.getDisplayValue(row, column)
          : this.getRawValue(row, filter.field as keyof T & string);

        return String(value ?? '')
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      }),
    );
  }

  get currentPageReport(): string {
    const totalRecords = this.totalRecordsCount;

    if (totalRecords === 0) {
      return 'Exibindo 0 de 0 itens';
    }

    const firstItem = Math.min(this.first + 1, totalRecords);
    const lastItem = Math.min(this.first + this.rows, totalRecords);

    return `Exibindo ${firstItem} a ${lastItem} de ${totalRecords} itens`;
  }

  get sortedData(): T[] {
    const sourceData = this.filteredData;

    if (!this.sortField || this.isRemotePagedMode) {
      return [...sourceData];
    }

    return [...sourceData].sort((current, next) => {
      const currentValue = this.getRawValue(current, this.sortField!);
      const nextValue = this.getRawValue(next, this.sortField!);
      return this.compareValues(currentValue, nextValue) * this.sortOrder;
    });
  }

  get mobilePageData(): T[] {
    if (this.isRemotePagedMode) {
      return this.sortedData;
    }

    if (!this.paginator) {
      return this.sortedData;
    }

    return this.sortedData.slice(this.first, this.first + this.rows);
  }

  get totalRecordsCount(): number {
    if (this.isRemotePagedMode) {
      if (this.remoteTotalRecords > 0) {
        return this.remoteTotalRecords;
      }

      if (this.totalRecords !== undefined && this.totalRecords !== null && this.totalRecords >= 0) {
        return this.totalRecords;
      }

      return this.filteredData.length;
    }

    if (this.totalRecords !== undefined && this.totalRecords !== null && this.totalRecords >= 0) {
      return this.totalRecords;
    }

    if (this.hasActiveFilters) {
      return this.filteredData.length;
    }

    return this.filteredData.length;
  }

  isSortable = (column: GenericsTableColumn<T>): boolean => column.sortable !== false;

  getAlignClass = (align: GenericsTableColumnAlign | undefined): string => {
    if (align === 'right') {
      return 'text-right';
    }

    if (align === 'center') {
      return 'text-center';
    }

    return 'text-left';
  };

  getJustifyClass = (align: GenericsTableColumnAlign | undefined): string => {
    if (align === 'right') {
      return 'justify-end';
    }

    if (align === 'center') {
      return 'justify-center';
    }

    return 'justify-start';
  };

  getDisplayValue = (row: T, column: GenericsTableColumn<T>): string => {
    const rawValue = this.getRawValue(row, column.field);
    const value = column.valueTransformFn ? column.valueTransformFn(rawValue, row) : rawValue;

    return this.formatValue(value, column);
  };

  getCardTitle = (row: T): string => {
    const field = this.cardTitleField ?? this.columns[0]?.field;

    if (!field) {
      return 'Registro';
    }

    const column = this.columns.find((item) => item.field === field);
    const value = column ? this.getDisplayValue(row, column) : this.getRawValue(row, field);

    return String(value || 'Registro');
  };

  getBadgeClass = (row: T, column: GenericsTableColumn<T>): string => {
    const value = this.getRawValue(row, column.field);

    if (column.badgeClassFn) {
      return column.badgeClassFn(value, row);
    }

    const normalizedValue = String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (
      normalizedValue.includes('atras') ||
      normalizedValue.includes('venc') ||
      normalizedValue.includes('erro')
    ) {
      return 'bg-red-100 text-red-700';
    }

    if (
      normalizedValue.includes('pago') ||
      normalizedValue.includes('quit') ||
      normalizedValue.includes('ativo')
    ) {
      return 'bg-emerald-100 text-emerald-700';
    }

    return 'bg-amber-100 text-amber-700';
  };

  getVisibleActions = (row: T): GenericsTableAction<T>[] =>
    this.actions.filter((action) => !action.showIf || action.showIf(row));

  isActionDisabled = (action: GenericsTableAction<T>, row: T): boolean =>
    action.disabled ? action.disabled(row) : false;

  getActionTooltip = (action: GenericsTableAction<T>): string | undefined => {
    if (this.isMobileViewport) {
      return undefined;
    }

    return action.tooltip || action.ariaLabel || action.label;
  };

  runAction = (event: Event, action: GenericsTableAction<T>, row: T): void => {
    event.stopPropagation();
    action.action(row);
  };

  onSort(event: SortEvent): void {
    const field = this.normalizeSortField(event.field);
    const nextOrder = event.order === -1 ? -1 : 1;

    if (this.sortField === field && this.sortOrder === nextOrder) {
      return;
    }

    this.sortField = field;
    this.sortOrder = nextOrder;
    this.sortChange.emit({ field, order: this.sortOrder });
    if (this.isRemotePagedMode) {
      this.queueRemoteLoad(true);
    }
  }

  onMobileSortFieldChange(field: string): void {
    const nextField = field ? (field as keyof T & string) : undefined;

    if (this.sortField === nextField) {
      return;
    }

    this.sortField = nextField;
    this.first = 0;
    this.sortChange.emit({ field: this.sortField, order: this.sortOrder });
    if (this.isRemotePagedMode) {
      this.queueRemoteLoad(true);
    }
  }

  toggleMobileSortOrder(): void {
    const nextOrder = this.sortOrder === 1 ? -1 : 1;

    if (this.sortOrder === nextOrder) {
      return;
    }

    this.sortOrder = nextOrder;
    this.first = 0;
    this.sortChange.emit({ field: this.sortField, order: this.sortOrder });
    if (this.isRemotePagedMode) {
      this.queueRemoteLoad(true);
    }
  }

  openFilters(): void {
    this.draftFilterValues = { ...this.filterValues };
    this.draftFilterDisplayValues = { ...this.filterDisplayValues };
    this.syncFilterTemplateContext();
    this.filterModalVisible = true;
  }

  closeFilters(): void {
    this.filterModalVisible = false;
  }

  onFilterPanelVisibleChange(visible: boolean): void {
    if (visible) {
      this.draftFilterValues = { ...this.filterValues };
      this.draftFilterDisplayValues = { ...this.filterDisplayValues };
      this.syncFilterTemplateContext();
    }

    this.filterModalVisible = visible;
  }

  onDraftFilterValueChange(
    field: string,
    value: GenericsTableFilterValue,
    displayValue?: string,
  ): void {
    this.draftFilterValues = {
      ...this.draftFilterValues,
      [field]: value,
    };

    if (displayValue !== undefined) {
      this.draftFilterDisplayValues = {
        ...this.draftFilterDisplayValues,
        [field]: displayValue,
      };
    }

    this.syncFilterTemplateContext();
  }

  applyFilters(): void {
    this.filterValues = this.sanitizeFilterValues(this.draftFilterValues);
    this.filterDisplayValues = this.sanitizeFilterDisplayValues(
      this.draftFilterDisplayValues,
      this.filterValues,
    );
    this.first = 0;
    this.filterModalVisible = false;
    this.syncFilterTemplateContext();
    this.filtersChange.emit({ ...this.filterValues });
    if (this.isRemoteMode) {
      this.queueRemoteLoad(true, this.filterValues as unknown as R);
    }
  }

  clearFilters(): void {
    this.filterValues = {};
    this.filterDisplayValues = {};
    this.draftFilterValues = {};
    this.draftFilterDisplayValues = {};
    this.first = 0;
    this.syncFilterTemplateContext();
    this.filtersChange.emit({});
    this.filtersCleared.emit();
    if (this.isRemoteMode) {
      this.queueRemoteLoad(true, this.filterValues as unknown as R);
    }
  }

  reload(): void {
    this.lastRemoteRequestKey = '';
    this.queueRemoteLoad();
  }

  resetPage(): void {
    this.first = 0;
    this.changeDetectorRef.markForCheck();
  }

  onPageChange(event: PaginatorState): void {
    const nextFirst = event.first ?? 0;
    const nextRows = event.rows ?? this.rows;

    if (nextFirst === this.first && nextRows === this.rows) {
      return;
    }

    this.first = nextFirst;
    this.rows = nextRows;
    this.pageChange.emit(event);
    if (this.isRemotePagedMode) {
      this.queueRemoteLoad();
    }
  }

  private queueInitialRemoteLoad(): void {
    if (this.initialRemoteLoadQueued || !this.viewInitialized || !this.isRemoteMode) {
      return;
    }

    this.initialRemoteLoadQueued = true;
    queueMicrotask(() => this.loadRemoteData());
  }

  private queueRemoteLoad(resetPage = false, filtersOverride?: R): void {
    queueMicrotask(() => this.loadRemoteData(resetPage, filtersOverride));
  }

  private loadRemoteData(resetPage = false, filtersOverride?: R): void {
    if (!this.fetchMethod || this.isDestroyed) {
      return;
    }

    if (resetPage) {
      this.first = 0;
    }

    const pageSize = Math.max(this.rows, 1);
    const pageNumber = Math.floor(this.first / pageSize) + 1;
    const filtros = {
      ...(filtersOverride ?? this.fetchFilters ?? (this.filterValues as unknown as R) ?? {}),
      TodosRegistros: this.todosRegistros,
    } as unknown as R;
    const requestKey = this.getRemoteRequestKey(pageSize, pageNumber, filtros);

    if (requestKey === this.lastRemoteRequestKey && !resetPage) {
      return;
    }

    this.remoteLoading = true;
    this.changeDetectorRef.markForCheck();
    this.lastRemoteRequestKey = requestKey;
    this.fetchSubscription?.unsubscribe();
    this.fetchSubscription = this.fetchMethod(pageSize, pageNumber, filtros).subscribe({
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
        } else {
          this.remoteResponseMode = this.todosRegistros ? 'all' : 'paged';
          this.remoteData = [];
          this.remoteTotalRecords = 0;
        }
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.remoteData = [];
        this.remoteTotalRecords = 0;
        this.remoteLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      complete: () => {
        this.remoteLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  private getRemoteRequestKey(pageSize: number, pageNumber: number, filtros?: R): string {
    return JSON.stringify({
      pageSize,
      pageNumber,
      sortField: this.sortField ?? null,
      sortOrder: this.sortOrder,
      filtros: filtros ?? null,
    });
  }

  private getRawValue(row: T, field: keyof T & string): unknown {
    return field.split('.').reduce<unknown>((value, key) => {
      if (!value || typeof value !== 'object') {
        return null;
      }

      return (value as Record<string, unknown>)[key];
    }, row);
  }

  private formatValue(value: unknown, column: GenericsTableColumn<T>): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (column.type === 'currency') {
      return this.formatCurrency(value);
    }

    if (column.type === 'date') {
      return this.formatDate(value);
    }

    return String(value);
  }

  private formatCurrency(value: unknown): string {
    const numericValue = this.toNumber(value);

    if (numericValue === null) {
      return String(value);
    }

    return this.currencyFormatter.format(numericValue);
  }

  private formatDate(value: unknown): string {
    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return this.dateFormatter.format(date);
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number') {
      return value;
    }

    const normalizedValue = String(value)
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    if (!/\d/.test(normalizedValue)) {
      return null;
    }

    const numericValue = Number(normalizedValue);

    return Number.isNaN(numericValue) ? null : numericValue;
  }

  private compareValues(currentValue: unknown, nextValue: unknown): number {
    if (currentValue === nextValue) {
      return 0;
    }

    if (currentValue === null || currentValue === undefined) {
      return -1;
    }

    if (nextValue === null || nextValue === undefined) {
      return 1;
    }

    const currentNumber = this.toNumber(currentValue);
    const nextNumber = this.toNumber(nextValue);

    if (currentNumber !== null && nextNumber !== null) {
      return currentNumber - nextNumber;
    }

    const currentDate = new Date(String(currentValue));
    const nextDate = new Date(String(nextValue));

    if (!Number.isNaN(currentDate.getTime()) && !Number.isNaN(nextDate.getTime())) {
      return currentDate.getTime() - nextDate.getTime();
    }

    return String(currentValue).localeCompare(String(nextValue), 'pt-BR', {
      numeric: true,
      sensitivity: 'base',
    });
  }

  private normalizeSortField(field: string | string[] | undefined): (keyof T & string) | undefined {
    if (Array.isArray(field)) {
      return field[0] as keyof T & string;
    }

    return field as (keyof T & string) | undefined;
  }

  private isViewportWithinCardBreakpoint(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= this.cardBreakpoint;
  }

  private getFilterHeader(field: string): string {
    return (
      this.filterLabels[field] ||
      this.columns.find((column) => column.field === field)?.header ||
      field
    );
  }

  private sanitizeFilterValues(
    values: Partial<Record<string, GenericsTableFilterValue>>,
  ): Partial<Record<string, GenericsTableFilterValue>> {
    return Object.entries(values).reduce<Partial<Record<string, GenericsTableFilterValue>>>(
      (filters, [field, value]) => {
        const filterValue = String(value ?? '').trim();

        if (filterValue) {
          filters[field] = value;
        }

        return filters;
      },
      {},
    );
  }

  private sanitizeFilterDisplayValues(
    displayValues: Partial<Record<string, string>>,
    activeValues: Partial<Record<string, GenericsTableFilterValue>>,
  ): Partial<Record<string, string>> {
    return Object.entries(displayValues).reduce<Partial<Record<string, string>>>(
      (filters, [field, value]) => {
        if (!(field in activeValues)) {
          return filters;
        }

        const displayValue = String(value ?? '').trim();

        if (displayValue) {
          filters[field] = displayValue;
        }

        return filters;
      },
      {},
    );
  }

  private syncFilterTemplateContext(): void {
    this.filterTemplateContext.$implicit = this.draftFilterValues;
    this.filterTemplateContext.values = this.draftFilterValues;
    this.filterTemplateContext.displayValues = this.draftFilterDisplayValues;
  }
}
