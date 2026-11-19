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
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';

import ValidatableInput from '../../@types/inputs.interface';

@Component({
  selector: 'app-input-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, SkeletonModule],
  templateUrl: './input-checkbox.component.html',
  styleUrl: './input-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputCheckboxComponent),
      multi: true,
    },
  ],
})
export class InputCheckboxComponent
  implements ControlValueAccessor, Validator, ValidatableInput, OnDestroy
{
  @Input() inputId = '';
  @Input() label = '';
  @Input() binary = true;
  @Input() labelClass = '';
  @Input() errorMessage = 'Este campo é obrigatório';
  @Input() error = false;
  @Input() isRequired = false;
  @Input() loading?: boolean;
  @Input() set disable(value: boolean) {
    this.setDisabledState(value);
  }

  @Output() changeEvent = new EventEmitter<CheckboxChangeEvent>();
  @Output() blurInput = new EventEmitter<unknown>();

  readonly innerControl = new FormControl<unknown>(null);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly innerControlSub: Subscription;
  private isWritingValue = false;

  onChange: (value: unknown) => void = () => {};
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

  writeValue(value: unknown): void {
    this.isWritingValue = true;
    this.innerControl.setValue(value, { emitEvent: false });
    this.isWritingValue = false;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  validate(): ValidationErrors | null {
    if (this.isRequired && !this.innerControl.value) {
      return { required: true };
    }
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

  onHandleChange(event: CheckboxChangeEvent): void {
    if (this.innerControl.disabled) {
      return;
    }

    this.changeEvent.emit(event);
    this.onTouched();
  }

  ngOnDestroy(): void {
    this.innerControlSub.unsubscribe();
  }
}
