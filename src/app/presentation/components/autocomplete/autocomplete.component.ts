import { Component, EventEmitter, Input, Output, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';

/**
 * Autocomplete com filtro local sobre uma lista (substitui o angular-ng-autocomplete).
 * O valor do form control é o objeto selecionado (ex.: { codigo, descricao }).
 */
@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [FormsModule, AutoCompleteModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AutocompleteComponent), multi: true }],
  template: `
    <p-autocomplete
      [ngModel]="valor"
      (ngModelChange)="aoAlterar($event)"
      [suggestions]="sugestoes()"
      (completeMethod)="filtrar($event)"
      (onSelect)="aoSelecionar($event)"
      (onClear)="aoLimpar()"
      (onFocus)="inputFocused.emit($event)"
      (onBlur)="onTouched()"
      [optionLabel]="searchKeyword"
      [placeholder]="placeholder"
      [disabled]="desabilitado"
      [invalid]="invalid"
      [dropdown]="dropdown"
      [forceSelection]="false"
      [showClear]="true"
      [delay]="150"
      [minLength]="minLength"
      [emptyMessage]="mensagemVazia"
      [showEmptyMessage]="true"
      [inputId]="inputId"
      appendTo="body"
      styleClass="w-full"
      inputStyleClass="w-full"
    />
  `
})
export class AutocompleteComponent implements ControlValueAccessor {
  /** Lista completa de itens a filtrar. */
  @Input() data: any[] | null | undefined = [];
  /** Campo do item usado para busca e exibição. */
  @Input() searchKeyword = 'descricao';
  @Input() placeholder = '';
  @Input() invalid: boolean | null | undefined = false;
  @Input() dropdown = true;
  @Input() minLength = 0;
  @Input() inputId?: string;
  @Input() mensagemVazia = 'Nenhum registro encontrado';

  @Output() selected = new EventEmitter<any>();
  @Output() inputChanged = new EventEmitter<string>();
  @Output() inputCleared = new EventEmitter<void>();
  @Output() inputFocused = new EventEmitter<any>();

  valor: any = null;
  desabilitado = false;
  readonly sugestoes = signal<any[]>([]);

  private onChange: (v: any) => void = () => {};
  onTouched: () => void = () => {};

  filtrar(event: AutoCompleteCompleteEvent): void {
    const termo = this.normalizar(event.query);
    const lista = this.data ?? [];
    this.sugestoes.set(
      termo ? lista.filter((item) => this.normalizar(String(item?.[this.searchKeyword] ?? '')).includes(termo)) : [...lista]
    );
  }

  aoAlterar(valor: any): void {
    this.valor = valor;
    this.onChange(valor);
    if (typeof valor === 'string') {
      this.inputChanged.emit(valor);
    }
  }

  aoSelecionar(event: AutoCompleteSelectEvent): void {
    this.selected.emit(event.value);
  }

  aoLimpar(): void {
    this.valor = null;
    this.onChange(null);
    this.inputCleared.emit();
  }

  writeValue(valor: any): void {
    this.valor = valor === '' ? null : valor;
  }

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.desabilitado = desabilitado;
  }

  private normalizar(texto: string): string {
    return (texto ?? '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }
}
