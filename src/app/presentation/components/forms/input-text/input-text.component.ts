/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import ValidatableInput from '../../@types/inputs.interface';

interface NumberProp {
  mode?: string;
  currency?: string;
  suffix: string;
  prefix: string;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  useGrouping?: boolean;
  maxlength: number | null;
  showButtons?: boolean;
}

export interface InputHelpInfo {
  label: string;
  sections: {
    title: string;
    description: string;
    note?: string;
  }[];
}

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    InputMaskModule,
    InputNumberModule,
    TextareaModule,
    MenuModule,
    TooltipModule,
    BadgeModule,
    TagModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent implements ControlValueAccessor, ValidatableInput {
  @Input() inputId: string = '';
  @Input() placeholder: string = '';
  @Input() nativeInputType: string = 'text';
  @Input() autocomplete: string = 'off';
  @Input() iconPosition: 'right' | 'left' = 'right';
  @Input() iconClass: string = '';
  @Input() leftIconClass?: string = '';
  @Input() label: string = '';
  @Input() isRequired: boolean = false;
  @Input() errorMessage: string = 'Este campo é obrigatório';
  @Input() error: boolean = false;
  @Input() disable: boolean = false;
  @Input() isClearClick: boolean = false;
  @Input() type?: 'maps' | 'whatsapp' | 'email' | 'copy' | 'phone';
  @Input() isAutoClear?: boolean = true;
  @Input() helpInfo?: InputHelpInfo;
  @Input() mask: string = '';
  @Input() patterns: any;
  @Input() isUnMask: boolean = false;
  @Input() loading?: boolean;
  @Input() isLink: boolean = false;
  @Input() linkIcon: string = 'pi pi-external-link';
  @Input() textAreaResizable: boolean = true;
  @Input() textAreaHeight?: string;
  @Input() maskFormatted: boolean = false;
  @Input() dropSpecialCharacters?: boolean = false;

  @Input() tipoInput?: 'input' | 'inputMask' | 'textArea' | 'inputNumber';
  @Input() rowsTexArea?: number = 1;
  @Input() colsTexArea?: number = 1;
  @Input() numberProp?: NumberProp;

  @Input() minLength?: number;
  @Input() maxLength?: number;

  @Input() showClearButton: boolean = false; // Controla se mostra o botão clear
  @Output() clear = new EventEmitter<void>(); // Evento emitido ao limpar

  @Output() blurInput = new EventEmitter<string>();
  @Output() focusInput = new EventEmitter<string>();
  @Output() enterEvent = new EventEmitter<string>();
  @Output() iconCustomClick = new EventEmitter<string>();
  @Output() linkClick = new EventEmitter<void>();

  value: string = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private messageService: MessageService) {}

  get characterCountLabel(): string | null {
    const length = this.value?.length || 0;

    if (this.minLength && this.maxLength) {
      return `${length} caracteres (mínimo ${this.minLength})`;
    }

    if (this.maxLength) {
      return `${length} caracteres (máximo ${this.maxLength})`;
    }

    if (this.minLength) {
      return `${length} caracteres (mínimo ${this.minLength})`;
    }

    return null;
  }

  writeValue(value: string): void {
    if (value == null) {
      this.value = '';
      return;
    }

    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
    this.blurInput.emit(this.value);
  }

  onEnter(): void {
    this.onTouched();
    const { value } = this;

    this.enterEvent.emit(value);
  }

  onFocus(): void {
    this.onTouched();
    this.focusInput.emit(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manterCursorNoFinal(event: any): void {
    const input = event?.originalEvent?.target as HTMLInputElement | null;
    if (input) {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }

  onClickIcon(event: Event): void {
    event.stopPropagation();
    this.handleTypeAction();
  }

  // Método para limpar input
  clearInput(): void {
    this.value = '';
    this.onChange(''); // Atualiza o ngModel
    this.clear.emit(); // Emite evento
  }

  // eslint-disable-next-line consistent-return
  private handleTypeAction(): void {
    switch (this.type) {
      case 'copy':
        return this.copyContent(this.value);
      case 'whatsapp':
        return this.redirectToWhatsApp(this.value);
      case 'email':
        return this.redirectToEmail(this.value);
      case 'phone':
        return this.callNumber(this.value);
      default:
        this.iconCustomClick.emit(this.value);
    }
  }

  private copyContent(value: string): void {
    navigator.clipboard.writeText(value);
    this.messageService.add({ severity: 'info', summary: 'Texto copiado!' });
  }

  private callNumber(value: string): void {
    const countryCode = '55';
    const formattedNumber = value.replace(/\D/g, '');
    window.location.href = `tel:+${countryCode}${formattedNumber}`;
  }

  private redirectToWhatsApp(value: string): void {
    const countryCode = '55';
    const formattedNumber = value.replace(/\D/g, '');
    window.open(`https://wa.me/${countryCode}${formattedNumber}`, '_blank');
  }

  private redirectToEmail(email: string): void {
    window.location.href = `mailto:${email}?subject=&body=`;
  }

  public getIconClassByType(type: string): string {
    const typeIcons: Record<'copy' | 'whatsapp' | 'email' | 'maps' | 'phone', string> = {
      copy: 'pi pi-copy',
      whatsapp: 'pi pi-whatsapp',
      email: 'pi pi-envelope',
      maps: 'pi pi-map',
      phone: 'pi pi-phone',
    };
    return typeIcons[type as keyof typeof typeIcons] || '';
  }
}
