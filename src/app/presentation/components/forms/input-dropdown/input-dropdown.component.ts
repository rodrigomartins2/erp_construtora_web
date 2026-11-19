import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import type { OverlayOptions } from 'primeng/api';
import type { SelectChangeEvent } from 'primeng/select';
import ValidatableInput from '../../@types/inputs.interface';

@Component({
  selector: 'app-input-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, SkeletonModule],
  templateUrl: './input-dropdown.component.html',
  styleUrl: './input-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDropdownComponent),
      multi: true,
    },
  ],
})
export class InputDropdownComponent implements ControlValueAccessor, ValidatableInput {
  @Input() options: unknown[] = [];
  @Input() optionLabel = '';
  @Input() optionValue = 'codigo';
  @Input() group = false;
  @Input() optionGroupLabel = 'label';
  @Input() optionGroupChildren = 'items';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() errorMessage = 'Este campo é obrigatório';
  @Input() error = false;
  @Input() isRequired = false;
  @Input() showClear = true;
  @Input() set disable(value: boolean) {
    this.setDisabledState(value);
  }
  @Input() loading?: boolean;
  @Input() filter = false;
  @Input() filterBy = '';
  @Input() dataKey = 'codigo';
  @Input() appendTo: HTMLElement | 'body' | null = 'body';
  @Input() overlayOptions: OverlayOptions | undefined;
  @Input() clear: () => void = () => {};
  @Output() selectionChange = new EventEmitter<string | number | null>();

  readonly innerControl = new FormControl<string | number | null>(null);
  private readonly cdr = inject(ChangeDetectorRef);

  onChange: (value: string | number | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | number | null): void {
    this.innerControl.setValue(value, { emitEvent: false });
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
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
  }

  onSelectChange(event: SelectChangeEvent): void {
    const value = event.value ?? null;

    this.onChange(value);
    this.selectionChange.emit(value);
    this.cdr.markForCheck();
  }

  onClear(): void {
    this.innerControl.setValue(null, { emitEvent: false });
    this.onChange(null);
    this.selectionChange.emit(null);
    this.clear();
    this.cdr.markForCheck();
  }
}
