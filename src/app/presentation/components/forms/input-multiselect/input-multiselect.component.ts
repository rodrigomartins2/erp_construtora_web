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
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import type { OverlayOptions } from 'primeng/api';
import type { MultiSelectChangeEvent } from 'primeng/multiselect';
import ValidatableInput from '../../@types/inputs.interface';

@Component({
  selector: 'app-input-multiselect',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectModule, SkeletonModule],
  templateUrl: './input-multiselect.component.html',
  styleUrl: './input-multiselect.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMultiselectComponent),
      multi: true,
    },
  ],
})
export class InputMultiselectComponent implements ControlValueAccessor, ValidatableInput {
  @Input() options: unknown[] = [];
  @Input() optionLabel = '';
  @Input() optionValue = 'codigo';
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
  @Input() maxSelectedLabels = 3;
  @Input() selectedItemsLabel = '{0} selecionados';
  @Input() clear: () => void = () => {};
  @Output() selectionChange = new EventEmitter<Array<string | number>>();

  readonly innerControl = new FormControl<Array<string | number>>([]);
  private readonly cdr = inject(ChangeDetectorRef);

  onChange: (value: Array<string | number>) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: Array<string | number> | null): void {
    this.innerControl.setValue(Array.isArray(value) ? [...value] : [], { emitEvent: false });
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Array<string | number>) => void): void {
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

  onSelectChange(event: MultiSelectChangeEvent): void {
    const value = Array.isArray(event.value) ? (event.value as Array<string | number>) : [];

    this.onChange(value);
    this.selectionChange.emit(value);
    this.cdr.markForCheck();
  }

  onClear(): void {
    this.innerControl.setValue([], { emitEvent: false });
    this.onChange([]);
    this.selectionChange.emit([]);
    this.clear();
    this.cdr.markForCheck();
  }
}
