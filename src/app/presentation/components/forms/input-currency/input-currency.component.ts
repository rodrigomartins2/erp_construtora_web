/* eslint-disable no-param-reassign */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';

/** Opções de formatação (mesmo formato usado antes com o ngx-currency). */
export interface CurrencyOptions {
  align?: 'left' | 'right';
  allowNegative?: boolean;
  allowZero?: boolean;
  decimal?: string;
  precision?: number;
  prefix?: string;
  suffix?: string;
  thousands?: string;
  nullable?: boolean;
  min?: number | null;
  max?: number | null;
}
import { extrairOrigemDestinoRota } from '../../../../core/utils';
import ValidatableInput from '../../@types/inputs.interface';

@Component({
  selector: 'app-input-currency',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputTextModule,
    SkeletonModule,
    InputNumberModule,
    InputIconModule,
    IconFieldModule,
  ],
  templateUrl: './input-currency.component.html',
  styleUrl: './input-currency.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCurrencyComponent),
      multi: true,
    },
  ],
})
export class InputCurrencyComponent implements ControlValueAccessor, ValidatableInput {
  @ViewChild('currencyInputNumber') currencyInputNumber?: InputNumber;

  private get currencyInput(): ElementRef<HTMLInputElement> | undefined {
    return this.currencyInputNumber?.input;
  }

  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() isRequired: boolean = false;
  @Input() errorMessage: string = 'Este campo é obrigatório';
  @Input() iconPosition: 'right' | 'left' = 'right';
  @Input() iconClass: string = '';
  @Input() error: boolean = false;
  @Input() disable: boolean = false;
  @Input() isAutoClear?: boolean = true;
  @Input() loading?: boolean;
  @Input() type?: 'maps' | 'whatsapp' | 'email' | 'copy' | 'phone';
  @Input() maxTotalDigits?: number;
  @Input() numberOptions: CurrencyOptions = {
    align: 'right',
    allowNegative: false,
    allowZero: false,
    decimal: '.',
    precision: 3,
    prefix: '',
    suffix: '',
    thousands: '',
    nullable: false,
    min: null,
    max: null,
  };

  @Output() blurInput = new EventEmitter<number | null>();
  @Output() focusInput = new EventEmitter<number | null>();
  @Output() enterEvent = new EventEmitter<number | null>();
  @Output() iconCustomClick = new EventEmitter<string>();

  value: number | null = null;

  constructor(private messageService: MessageService) {}

  private onChangeFn: (value: number | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  // Métodos obrigatórios do ControlValueAccessor
  writeValue(value: number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  /** Casas decimais configuradas (padrão 2). */
  get casasDecimais(): number {
    return this.numberOptions.precision ?? 2;
  }

  /** Mínimo permitido: sem negativos por padrão. */
  get minimo(): number | undefined {
    if (this.numberOptions.min != null) return this.numberOptions.min;
    return this.numberOptions.allowNegative ? undefined : 0;
  }

  // onInputChange(value: number): void {
  //     this.value = value;
  //     this.onChangeFn(this.value);
  // }

  onInputChange(value: number | null, input?: HTMLInputElement): void {
    if (this.maxTotalDigits != null && value != null) {
      let somenteNumeros = value.toString().replace(/\D/g, '');

      if (somenteNumeros.length > this.maxTotalDigits) {
        somenteNumeros = somenteNumeros.slice(0, this.maxTotalDigits);

        const limitado = Number(somenteNumeros) / 100;

        this.value = limitado;
        this.onChangeFn(this.value);

        if (input) input.value = limitado.toLocaleString('pt-BR', {
          minimumFractionDigits: this.numberOptions.precision ?? 2,
          maximumFractionDigits: this.numberOptions.precision ?? 2,
        });

        return;
      }
    }

    this.value = value;
    this.onChangeFn(this.value);
  }

  onTouched(): void {
    this.onTouchedFn();
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

  /**
   * O campo é alinhado à direita e a digitação financeira entra pelos centavos, então o cursor
   * vai sempre para o fim ao receber o foco. Adia para depois do posicionamento do clique.
   */
  moverCursorParaFim(input: HTMLInputElement): void {
    setTimeout(() => {
      if (document.activeElement !== input) return;
      const fim = input.value.length;
      input.setSelectionRange(fim, fim);
    });
  }

  onFocus(): void {
    this.onTouched();
    this.focusInput.emit(this.value);
  }

  focus(select: boolean = false): void {
    this.currencyInput?.nativeElement.focus();
    if (select) {
      this.currencyInput?.nativeElement.select();
    }
  }

  onClickIcon(event: Event): void {
    event.stopPropagation();
    this.handleTypeAction();
  }

  private handleTypeAction(): void {
    switch (this.type) {
      case 'copy':
        this.copyContent(this.value?.toString() || '');
        break;
      case 'whatsapp':
        this.redirectToWhatsApp(this.value?.toString() || '');
        break;
      case 'email':
        this.redirectToEmail(this.value?.toString() || '');
        break;
      case 'maps':
        this.redirectToGoogleMaps(this.value?.toString() || '');
        break;
      case 'phone':
        this.callNumber(this.value?.toString() || '');
        break;
      default:
        this.iconCustomClick.emit(this.value?.toString() || '');
        break;
    }
  }

  private copyContent(value: string): void {
    navigator.clipboard.writeText(value);
    this.messageService.add({ severity: 'info', summary: 'Texto copiado!' });
  }

  private callNumber(value: string): void {
    const countryCode = '55';
    const formattedNumber = value.replace(/\D/g, '');
    const telUrl = `tel:+${countryCode}${formattedNumber}`;
    window.location.href = telUrl;
  }

  private redirectToWhatsApp(value: string): void {
    const countryCode = '55';
    const formattedNumber = value.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${countryCode}${formattedNumber}`;
    window.open(whatsappUrl, '_blank');
  }

  private redirectToEmail(email: string): void {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent('')}&body=${encodeURIComponent('')}`;
    window.location.href = mailtoUrl;
  }

  private redirectToGoogleMaps(rota: string): void {
    const [origem, destino] = extrairOrigemDestinoRota(rota);
    if (origem && destino) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        origem,
      )}&destination=${encodeURIComponent(destino)}&travelmode=driving`;
      window.open(url, '_blank');
    } else if (this.value) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.value)}`;
      window.open(url, '_blank');
    }
  }

  public getIconClassByType(type: string): string {
    const typeIcons: Record<'copy' | 'whatsapp' | 'email' | 'maps' | 'phone', string> = {
      copy: 'pi pi-copy text-primary',
      whatsapp: 'pi pi-whatsapp text-primary',
      email: 'pi pi-envelope text-primary',
      maps: 'pi pi-map text-primary',
      phone: 'pi pi-phone text-primary',
    };
    return typeIcons[type as keyof typeof typeIcons] || '';
  }
}
