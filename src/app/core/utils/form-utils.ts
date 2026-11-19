import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormUtils {
  static readonly emailPattern = /^[^\s@]+@[^\s@]+(\.[^\s@]{2,})+$/;

  static cpfValidator(): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const cpf = value.replace(/\D/g, '');

      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return { cpf: true };
      }

      const primeiroDigito = FormUtils.calcularDigitoCpf(cpf, 9);
      const segundoDigito = FormUtils.calcularDigitoCpf(cpf, 10);

      return primeiroDigito === Number(cpf[9]) && segundoDigito === Number(cpf[10])
        ? null
        : { cpf: true };
    };
  }

  static calcularDigitoCpf(cpf: string, tamanho: number): number {
    let soma = 0;

    for (let index = 0; index < tamanho; index += 1) {
      soma += Number(cpf[index]) * (tamanho + 1 - index);
    }

    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  }

  static formatDateValue(value: string | Date | null): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      const day = String(value.getDate()).padStart(2, '0');
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const year = value.getFullYear();

      return `${day}/${month}/${year}`;
    }

    const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;

      return `${day}/${month}/${year}`;
    }

    return value;
  }

  static parseDateValue(value: string | Date | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    const brDateMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (brDateMatch) {
      const [, day, month, year] = brDateMatch;
      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return Number.isNaN(date.getTime()) ? null : date;
    }

    const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  static normalizarTexto(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  static toPayloadString(value: string | number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
  }
}
