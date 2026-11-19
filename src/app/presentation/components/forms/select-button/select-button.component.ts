/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectButtonModule } from 'primeng/selectbutton';
import ValidatableInput from '../../@types/inputs.interface';

@Component({
  selector: 'app-select-button',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, FormsModule, BreadcrumbModule],
  templateUrl: './select-button.component.html',
  styleUrl: './select-button.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectButtonComponent),
      multi: true,
    },
  ],
})
export class SelectButtonComponent implements ControlValueAccessor, ValidatableInput, OnInit {
  @Input() label: string = '';
  @Input() isRequired: boolean = false;
  @Input() errorMessage: string = 'Este campo é obrigatório';
  @Input() error: boolean = false;
  @Input() disable: boolean = false;
  @Input() multiple?: boolean = false;
  @Input() allowEmpty: boolean = false;
  @Input() loading?: boolean;
  @Input() options: Array<{ label: string; value: string }> = [];
  @Input() optionDisabled?: string;
  @Input() activeColor: string = '';
  @Input() ngClass: any; // Adicione esta linha

  value: string = '';

  ngOnInit() {
    if (this.activeColor) {
      document.documentElement.style.setProperty('--active-color', this.activeColor);
    }
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

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

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
