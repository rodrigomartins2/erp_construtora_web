import { TemplateRef } from '@angular/core';

export type ButtonProp = {
  key?: string;
  action: () => void;
  icon?: string;
  iconType?: 'prime' | 'material';
  rounded?: boolean;
  loading?: boolean;
  outlined?: boolean;
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
  altText?: string;
  iconPos?: 'right' | 'left';
  className?: string;
  label?: string;
  disable?: boolean;
  text?: boolean;
  showIf?: boolean;
  showIfKey?: string;
  tooltipText?: string;
  template?: TemplateRef<unknown>;
  style?: null | Record<string, unknown>;
};
