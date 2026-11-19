import { Directive, ElementRef, HostListener, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Máscara simples para inputs de texto (substitui o ngx-mask).
 *
 * - `0` representa um dígito; qualquer outro caractere é literal.
 * - Várias máscaras podem ser separadas por `||`; é usada a primeira cuja
 *   quantidade de dígitos comporta o valor digitado
 *   (ex.: `000.000.000-00||00.000.000/0000-00`).
 * - `dropSpecialCharacters` (padrão true) faz o form control receber só os dígitos.
 */
@Directive({
  selector: 'input[mask]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MaskDirective), multi: true }]
})
export class MaskDirective implements ControlValueAccessor {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private mascaras: string[] = [];

  @Input() set mask(valor: string) {
    this.mascaras = (valor ?? '')
      .split('||')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)
      .sort((a, b) => this.totalDigitos(a) - this.totalDigitos(b));
    this.aplicar(this.el.nativeElement.value);
  }

  @Input() dropSpecialCharacters = true;

  private onChange: (valor: any) => void = () => {};
  private onTouched: () => void = () => {};

  @HostListener('input')
  aoDigitar(): void {
    const formatado = this.aplicar(this.el.nativeElement.value);
    this.onChange(this.dropSpecialCharacters ? this.somenteDigitos(formatado) : formatado);
  }

  @HostListener('blur')
  aoSair(): void {
    this.onTouched();
  }

  writeValue(valor: any): void {
    this.aplicar(valor == null ? '' : String(valor));
  }

  registerOnChange(fn: (valor: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.el.nativeElement.disabled = desabilitado;
  }

  private aplicar(valor: string): string {
    const digitos = this.somenteDigitos(valor);
    const mascara = this.escolherMascara(digitos.length);
    const formatado = mascara ? this.formatar(digitos, mascara) : valor;
    this.el.nativeElement.value = formatado;
    return formatado;
  }

  private escolherMascara(qtdDigitos: number): string | undefined {
    if (this.mascaras.length === 0) {
      return undefined;
    }
    return this.mascaras.find((m) => qtdDigitos <= this.totalDigitos(m)) ?? this.mascaras[this.mascaras.length - 1];
  }

  private formatar(digitos: string, mascara: string): string {
    let resultado = '';
    let i = 0;
    for (const c of mascara) {
      if (i >= digitos.length) {
        break;
      }
      if (c === '0') {
        resultado += digitos[i++];
      } else {
        resultado += c;
      }
    }
    return resultado;
  }

  private totalDigitos(mascara: string): number {
    return mascara.split('').filter((c) => c === '0').length;
  }

  private somenteDigitos(valor: string): string {
    return (valor ?? '').replace(/\D/g, '');
  }
}
