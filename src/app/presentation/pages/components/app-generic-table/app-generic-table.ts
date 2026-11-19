import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';

export type AppGenericTableColumnType = 'text' | 'currency' | 'date' | 'badge';
export type AppGenericTableColumnAlign = 'left' | 'center' | 'right';

export interface AppGenericTableColumn {
  field: string;
  header: string;
  type?: AppGenericTableColumnType;
  align?: AppGenericTableColumnAlign;
  sortable?: boolean;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './app-generic-table.html',
  styleUrl: './app-generic-table.css',
})
export class AppGenericTable {
  @Input({ required: true }) columns: AppGenericTableColumn[] = [];
  @Input({ required: true }) data: unknown[] = [];
  @Input() rows = 5;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20];
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Input() loading = false;
  @Input() minWidth = '42rem';

  isSortable(column: AppGenericTableColumn): boolean {
    return column.sortable !== false;
  }

  getAlignClass(align: AppGenericTableColumnAlign | undefined): string {
    if (align === 'right') {
      return 'text-right';
    }

    if (align === 'center') {
      return 'text-center';
    }

    return 'text-left';
  }

  getValue(row: unknown, field: string): unknown {
    return field.split('.').reduce<unknown>((value, key) => {
      if (!value || typeof value !== 'object') {
        return null;
      }

      return (value as Record<string, unknown>)[key];
    }, row);
  }

  formatValue(value: unknown, column: AppGenericTableColumn): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (column.type === 'currency') {
      return this.formatCurrency(value);
    }

    if (column.type === 'date') {
      return this.formatDate(value);
    }

    return String(value);
  }

  getBadgeClass(value: unknown): string {
    const normalizedValue = String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (normalizedValue.includes('atras') || normalizedValue.includes('venc')) {
      return 'bg-error-container/20 text-on-error-container';
    }

    if (normalizedValue.includes('pago') || normalizedValue.includes('quit')) {
      return 'bg-emerald-100 text-emerald-700';
    }

    return 'bg-amber-100 text-amber-700';
  }

  private formatCurrency(value: unknown): string {
    const numericValue = this.toNumber(value);

    if (numericValue === null) {
      return String(value);
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  }

  private formatDate(value: unknown): string {
    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number') {
      return value;
    }

    const normalizedValue = this.normalizeCurrencyValue(String(value));
    const numericValue = Number(normalizedValue);

    return Number.isNaN(numericValue) ? null : numericValue;
  }

  private normalizeCurrencyValue(value: string): string {
    const digitsAndSeparators = value.replace(/[^\d,.-]/g, '');
    const lastDot = digitsAndSeparators.lastIndexOf('.');
    const lastComma = digitsAndSeparators.lastIndexOf(',');

    if (lastDot !== -1 && lastComma !== -1) {
      return lastDot > lastComma
        ? digitsAndSeparators.replace(/,/g, '')
        : digitsAndSeparators.replace(/\./g, '').replace(',', '.');
    }

    if (lastComma !== -1) {
      return digitsAndSeparators.replace(/\./g, '').replace(',', '.');
    }

    return digitsAndSeparators;
  }
}
