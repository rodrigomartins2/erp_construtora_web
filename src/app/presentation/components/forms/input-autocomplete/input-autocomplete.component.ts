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
import { AutoCompleteModule } from 'primeng/autocomplete';
import type {
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/types/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import type { OverlayOptions } from 'primeng/api';
import ValidatableInput from '../../@types/inputs.interface';

export type AutoCompleteValue = string | number | object | AutoCompleteValue[] | null;

@Component({
  selector: 'app-input-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule, SkeletonModule],
  templateUrl: './input-autocomplete.component.html',
  styleUrl: './input-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocompleteComponent),
      multi: true,
    },
  ],
})
export class InputAutocompleteComponent implements ControlValueAccessor, ValidatableInput {
  private currentSuggestions: unknown[] = [];
  private awaitingSearchResponse = false;
  showEmptyMessage = false;

  @Input() get suggestions(): unknown[] {
    return this.currentSuggestions;
  }

  set suggestions(value: unknown[]) {
    this.currentSuggestions = value;
    if (this.awaitingSearchResponse) {
      this.awaitingSearchResponse = false;
      this.showEmptyMessage = true;
    }
    this.cdr.markForCheck();
  }
  @Input() optionLabel = '';
  @Input() optionValue?: string;
  @Input() dataKey?: string;
  @Input() inputId = '';
  @Input() placeholder = '';
  @Input() label = '';
  @Input() showQuickCreate = false;
  @Input() quickCreateLabel = 'Novo Cadastro Rápido';
  @Input() errorMessage = 'Este campo é obrigatório';
  @Input() error = false;
  @Input() isRequired = false;
  @Input() loading = false;
  @Input() showClear = true;
  @Input() forceSelection = true;
  @Input() dropdown = false;
  @Input() multiple = false;
  @Input() completeOnFocus = false;
  @Input() autoHighlight = true;
  @Input() minLength = 1;
  @Input() delay = 300;
  @Input() emptyMessage = 'Nenhum resultado encontrado';
  @Input() appendTo: HTMLElement | 'body' | null = 'body';
  @Input() overlayOptions?: OverlayOptions;
  @Input() set disable(value: boolean) {
    this.setDisabledState(value);
  }

  @Output() searchChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<AutoCompleteValue>();
  @Output() cleared = new EventEmitter<void>();
  @Output() quickCreate = new EventEmitter<void>();

  readonly innerControl = new FormControl<AutoCompleteValue>(null);
  private readonly cdr = inject(ChangeDetectorRef);

  onChange: (value: AutoCompleteValue) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: AutoCompleteValue): void {
    this.innerControl.setValue(value ?? null, { emitEvent: false });
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: AutoCompleteValue) => void): void {
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

  onComplete(event: AutoCompleteCompleteEvent): void {
    this.awaitingSearchResponse = true;
    this.showEmptyMessage = false;
    this.searchChange.emit(event.query);
    this.cdr.markForCheck();
  }

  onSelect(event: AutoCompleteSelectEvent): void {
    const value = (this.innerControl.value ?? event.value ?? null) as AutoCompleteValue;

    this.onChange(value);
    this.selectionChange.emit(value);
    this.cdr.markForCheck();
  }

  onClear(): void {
    this.awaitingSearchResponse = false;
    this.showEmptyMessage = false;
    this.innerControl.setValue(null, { emitEvent: false });
    this.onChange(null);
    this.selectionChange.emit(null);
    this.cleared.emit();
    this.cdr.markForCheck();
  }

  onBlur(): void {
    this.onTouched();
  }

  onQuickCreate(): void {
    if (this.showQuickCreate && !this.loading && !this.innerControl.disabled) {
      this.quickCreate.emit();
    }
  }
}
