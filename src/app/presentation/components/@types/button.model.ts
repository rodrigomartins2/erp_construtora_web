/* eslint-disable @typescript-eslint/no-explicit-any */

import { TemplateRef } from '@angular/core';

/* eslint-disable prettier/prettier */
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
  template?: TemplateRef<any>;
  style?: null | { [klass: string]: any };
};
