type ButtonSeverity =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'help'
  | 'primary'
  | 'secondary'
  | 'contrast';
type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

export type PropButton = {
  class?: string;
  icon?: string;
  severity?: ButtonSeverity;
  outlined?: string;
  iconPos?: ButtonIconPosition;
  label?: string;
};
