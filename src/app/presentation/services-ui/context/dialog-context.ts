import { signal } from '@angular/core';

import { ButtonProp } from '../../components/@types/button.model';

export class DialogContext {
  readonly title = signal<string>('');
  readonly subtext = signal<string | undefined>(undefined);
  readonly icon = signal<string | undefined>(undefined);
  readonly iconType = signal<'prime' | 'material'>('prime');
  readonly tagText = signal<string | undefined>(undefined);

  readonly footerButtons = signal<ButtonProp[]>([]);
  readonly showFooter = signal<boolean>(true);

  updateButton(key: string, changes: Partial<Omit<ButtonProp, 'key' | 'action'>>): void {
    this.footerButtons.update((buttons) =>
      buttons.map((btn) => (btn.key === key ? { ...btn, ...changes } : btn)),
    );
  }

  setButtonLoading(key: string, loading: boolean): void {
    this.updateButton(key, { loading });
  }

  setButtonDisabled(key: string, disable: boolean): void {
    this.updateButton(key, { disable });
  }

  setButtonLabel(key: string, label: string): void {
    this.updateButton(key, { label });
  }

  toggleFooter(show: boolean): void {
    this.showFooter.set(show);
  }
}
