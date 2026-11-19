import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';

import ValidatableInput from '../../@types/inputs.interface';

export type InputCalendarValue = Date | Date[] | string | null;

@Component({
  selector: 'app-input-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, SkeletonModule],
  templateUrl: './input-calendar.component.html',
  styleUrl: './input-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCalendarComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputCalendarComponent),
      multi: true,
    },
  ],
})
export class InputCalendarComponent
  implements ControlValueAccessor, Validator, ValidatableInput, OnDestroy
{
  @Input() inputId = '';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() errorMessage = 'Este campo é obrigatório';
  @Input() error = false;
  @Input() isRequired = false;
  @Input() isRRequerired = false;
  @Input() loading?: boolean;
  @Input() dateFormat = 'dd/mm/yy';
  @Input() showIcon = true;
  @Input() iconDisplay: 'button' | 'input' = 'input';
  @Input() showClear = true;
  @Input() showButtonBar = false;
  @Input() readonlyInput = false;
  @Input() showOnFocus = true;
  @Input() showTime = false;
  @Input() timeOnly = false;
  @Input() hourFormat: '12' | '24' = '24';
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
  @Input() numberOfMonths = 1;
  @Input() firstDayOfWeek = 0;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() defaultDate: Date | null = null;
  @Input() disabledDates: Date[] = [];
  @Input() disabledDays: number[] = [];
  @Input() dataType: 'date' | 'string' = 'date';
  @Input() appendTo: HTMLElement | 'body' | null = 'body';
  @Input() autoZIndex = true;
  // Zero lets PrimeNG use the application's shared overlay layer.
  @Input() baseZIndex = 0;
  @Input() set disable(value: boolean) {
    this.setDisabledState(value);
  }

  @Output() blurInput = new EventEmitter<InputCalendarValue>();
  @Output() focusInput = new EventEmitter<Event>();
  @Output() selectDate = new EventEmitter<Date>();
  @Output() clear = new EventEmitter<void>();

  readonly innerControl = new FormControl<InputCalendarValue>(null);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly innerControlSub: Subscription;
  private isWritingValue = false;
  internalInvalidDate = false;

  onChange: (value: InputCalendarValue) => void = () => {};
  onTouched: () => void = () => {};
  onValidatorChange: () => void = () => {};

  constructor() {
    this.innerControlSub = this.innerControl.valueChanges.subscribe((value) => {
      if (this.isWritingValue) {
        return;
      }

      this.onChange(value);
      this.onValidatorChange();
    });
  }

  writeValue(value: InputCalendarValue): void {
    this.isWritingValue = true;
    this.innerControl.setValue(this.toInnerValue(value), { emitEvent: false });
    this.isWritingValue = false;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: InputCalendarValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.shouldValidateDateMask()) {
      this.setInternalInvalidDate(false);
      return null;
    }

    const value = control.value as InputCalendarValue;

    if (value === null || value === undefined || value === '') {
      this.setInternalInvalidDate(false);
      return null;
    }

    if (value instanceof Date) {
      return this.resolveDateValidation(this.isValidDateObject(value));
    }

    if (typeof value === 'string') {
      return this.resolveDateValidation(this.isValidDateString(value));
    }

    this.setInternalInvalidDate(false);
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.innerControl.disable({ emitEvent: false });
    } else {
      this.innerControl.enable({ emitEvent: false });
    }

    this.cdr.markForCheck();
  }

  onBlur(): void {
    this.onTouched();
    this.blurInput.emit(this.innerControl.value);
  }

  onFocus(event: Event): void {
    this.focusInput.emit(event);
  }

  onSelect(value: Date): void {
    this.onTouched();
    this.selectDate.emit(value);
    this.onValidatorChange();
  }

  onClear(): void {
    this.onTouched();
    this.clear.emit();
    this.onValidatorChange();
  }

  onInput(event: Event): void {
    if (!this.shouldApplyDateMask()) {
      return;
    }

    const input = event.target as HTMLInputElement | null;

    if (!input) {
      return;
    }

    const maskedValue = this.applyDateMask(input.value);

    if (input.value !== maskedValue) {
      input.value = maskedValue;
    }

    this.isWritingValue = true;
    this.innerControl.setValue(maskedValue || null, { emitEvent: false });
    this.isWritingValue = false;
    this.onChange(maskedValue || null);
    this.onValidatorChange();
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.innerControlSub.unsubscribe();
  }

  private shouldApplyDateMask(): boolean {
    return (
      this.dateFormat === 'dd/mm/yy' &&
      this.selectionMode === 'single' &&
      !this.showTime &&
      !this.timeOnly
    );
  }

  private shouldValidateDateMask(): boolean {
    return this.shouldApplyDateMask();
  }

  private applyDateMask(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    return [day, month, year].filter(Boolean).join('/');
  }

  private isValidDateString(value: string): boolean {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return false;
    }

    const [day, month, year] = value.split('/').map(Number);

    if (year < 1 || month < 1 || month > 12 || day < 1) {
      return false;
    }

    const date = new Date(year, month - 1, day);

    return (
      this.isValidDateObject(date) &&
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  }

  private isValidDateObject(value: Date): boolean {
    if (Number.isNaN(value.getTime())) {
      return false;
    }

    const date = this.withoutTime(value);

    if (this.minDate && date < this.withoutTime(this.minDate)) {
      return false;
    }

    if (this.maxDate && date > this.withoutTime(this.maxDate)) {
      return false;
    }

    return true;
  }

  private withoutTime(value: Date): Date {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  private resolveDateValidation(isValid: boolean): ValidationErrors | null {
    this.setInternalInvalidDate(!isValid);
    return isValid ? null : { invalidDate: true };
  }

  private toInnerValue(value: InputCalendarValue): InputCalendarValue {
    if (this.dataType !== 'date' || value === null || value === undefined || value === '') {
      return value ?? null;
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => this.toInnerDate(item))
        .filter((item): item is Date => item instanceof Date);
    }

    return this.toInnerDate(value);
  }

  private toInnerDate(value: Date | string): Date | string | null {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value !== 'string') {
      return null;
    }

    const text = value.trim();
    if (!text) {
      return null;
    }

    const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const brMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (brMatch) {
      const [, day, month, year] = brMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? text : parsed;
  }

  private setInternalInvalidDate(value: boolean): void {
    if (this.internalInvalidDate === value) {
      return;
    }

    this.internalInvalidDate = value;
    this.cdr.markForCheck();
  }
}
