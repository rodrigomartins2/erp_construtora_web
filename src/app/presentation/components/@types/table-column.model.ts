/* eslint-disable prettier/prettier */
import { TemplateRef } from '@angular/core';

export type CurrencyInputOptions = {
  align?: 'left' | 'right';
  allowNegative?: boolean;
  decimal?: string;
  precision?: number;
  prefix?: string;
  suffix?: string;
  thousands?: string;
  nullable?: boolean;
  min?: number;
  max?: number;
};

export type InfoLogCard = {
  codUsuario: number;
  dataLog: Date;
  filial: string;
  imagemUsuario?: string;
};

/* Tipagem tabela */

export enum TableColumnType {
  TEXT = 'text',
  BADGE = 'badge',
  AVATAR = 'avatar',
}

export enum TableColumnFilterType {
  TEXT = 'text',
  DROPDOWN = 'dropdown',
  MULTI_SELECT = 'multi-select',
  DATE = 'date',
  DECIMAL = 'decimal',
  CURRENCY = 'currency',
}

export type FilterOption<T> = {
  label: string;
  value: T;
};

export type TagOption = {
  value: string | number;
  label: string;
  field: string;
  background?: string;
  color?: string;
};

export type FooterCellContent =
  | string
  | number
  | null
  | undefined
  | (() => string | number | null | undefined);

export type TableColumnFooter = {
  text?: FooterCellContent;
  value?: FooterCellContent;
  textBold?: boolean;
  valueBold?: boolean;
  align?: 'left' | 'right' | 'center';
  backgroundColor?: string;
  textColor?: string;
};

export type BaseTableColumn<T> = {
  field: keyof T & string;
  header: string;
  width?: string;
  styleClass?: string;
  padding?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  icon?: string;
  iconActionClick?: (item?: T) => void;
  linkActionClick?: (item?: T) => void;
  linkCondition?: (item?: T) => boolean;
  imageAvatarField?: keyof T & string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueTransformFn?: (value: keyof T & any, item?: T) => any;
  footer?: TableColumnFooter;
} & (
  | { type: TableColumnType; template?: never }
  | { type?: never; template: TemplateRef<unknown> }
);

export type TableDateInputProps = {
  placeholder?: string;
  selectionMode?: 'single' | 'multiple' | 'range';
  view?: 'date' | 'month' | 'year';
  minDate?: Date;
  maxDate?: Date;
  showButtonBar?: boolean;
  showClear?: boolean;
  numberOfMonths?: number;
};

export type DataTableColumn<T> = BaseTableColumn<T> & {
  freezable?: boolean;
  filterType?: TableColumnFilterType;
  filterMask?: string;
  numberOptions?: Partial<CurrencyInputOptions>;
  dropDownOptions?: Array<{ label: string; value: string }>;
  showFilterIcon?: boolean;
  infoColumn?: boolean;
  defaultFilterValue?: string | number | Date | Array<string | number | Date>;
  isFilterable?: boolean;
  sortFieldName?: string;
  dateInputProps?: TableDateInputProps;
};

export type ActionButtonTable<T> = {
  icon: string;
  action: (item?: T) => void;
  showIf?: (item: T) => boolean;
  altText?: string;
  severity?:
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null
    | undefined;
  styleClass?: string;
};
