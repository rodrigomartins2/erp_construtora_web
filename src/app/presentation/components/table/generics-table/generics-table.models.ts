import type { TemplateRef } from '@angular/core';

export type GenericsTableColumnType = 'text' | 'currency' | 'date' | 'badge';
export type GenericsTableColumnAlign = 'left' | 'center' | 'right';
export type GenericsTableColumnFilterType =
  | 'text'
  | 'date'
  | 'currency'
  | 'dropdown'
  | 'multi-select';
export type GenericsTableFilterValue =
  | string
  | number
  | boolean
  | Array<string | number>
  | null
  | undefined;

export interface GenericsTableFilterOption {
  label: string;
  value: string | number;
}

export interface GenericsTableColumn<T> {
  field: keyof T & string;
  header: string;
  type?: GenericsTableColumnType;
  filterType?: GenericsTableColumnFilterType;
  align?: GenericsTableColumnAlign;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  /** Quebra o texto em várias linhas em vez de cortar com reticências. */
  wrap?: boolean;
  styleClass?: string;
  badgeStyleClass?: string;
  filterOptions?: GenericsTableFilterOption[];
  filterPlaceholder?: string;
  template?: TemplateRef<{ $implicit: T; field: keyof T & string }>;
  valueTransformFn?: (value: unknown, item: T) => unknown;
  badgeClassFn?: (value: unknown, item: T) => string;
}

export interface GenericsTableAction<T> {
  icon: string;
  label?: string;
  ariaLabel?: string;
  tooltip?: string;
  action: (item: T) => void;
  showIf?: (item: T) => boolean;
  disabled?: (item: T) => boolean;
  severity?:
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null;
  outlined?: boolean;
  rounded?: boolean;
  styleClass?: string;
}

export interface GenericsTableFilterModalButton {
  label: string;
  icon?: string;
  severity?:
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null;
  outlined?: boolean;
  text?: boolean;
}

export interface GenericsTableFilterModalButtons {
  cancel?: GenericsTableFilterModalButton;
  clear?: GenericsTableFilterModalButton;
  apply?: GenericsTableFilterModalButton;
}

export interface GenericsTableFilterTemplateContext<_T> {
  $implicit: Partial<Record<string, GenericsTableFilterValue>>;
  values: Partial<Record<string, GenericsTableFilterValue>>;
  displayValues: Partial<Record<string, string>>;
  setValue: (field: string, value: GenericsTableFilterValue, displayValue?: string) => void;
  setValues: (
    values: Partial<Record<string, GenericsTableFilterValue>>,
    displayValues?: Partial<Record<string, string>>,
  ) => void;
}
