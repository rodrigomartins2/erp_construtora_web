import { TemplateRef } from '@angular/core';

import { TagOption } from './table-column.model';

export type CardTableColumn<T> = {
  field: keyof T & string;
  header: string;
  type?: 'text' | 'badge' | 'link' | 'avatar';
  mobileLayout?: 'inline' | 'stacked';
  icon?: string;
  iconActionClick?: (item: T) => void;
  iconCondition?: (item: T) => boolean;
  imageAvatarField?: keyof T & string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueTransformFn?: (value: any, item?: T) => any;
  linkActionClick?: (item: T) => void;
  linkCondition?: (item: T) => boolean;
  linkPermission?: string | string[];
  template?: TemplateRef<unknown>;
};

export type CardTableTag<T> = {
  field: keyof T & string;
  tagOptions: TagOption[];
};

export type CardTableButton<T> = {
  label: string;
  icon?: string;
  action: (item: T) => void;
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
  showIf?: (item: T) => boolean;
  loading?: (item: T) => boolean;
};

export type CardGroup<T> = {
  label: string;
  dateRange: string;
  dotColor: string;
  items: T[];
};

export type CardTableTotalizador<T> = {
  label: string;
  activeColor: string;
  badgeBackground?: string;
  filterField: keyof T & string;
  filterValue: string;
};
