import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterPersistenceService {
  private readonly STORAGE_KEY_PREFIX = 'table_filters_';

  saveFilters<TFilters extends object>(key: string, filters: TFilters): void {
    const storageKey = this.STORAGE_KEY_PREFIX + key;
    localStorage.setItem(storageKey, JSON.stringify(filters));
  }

  getFilters<TFilters>(key: string): TFilters | null {
    const storageKey = this.STORAGE_KEY_PREFIX + key;
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as TFilters;
    } catch {
      return null;
    }
  }

  clearFilters(key: string): void {
    const storageKey = this.STORAGE_KEY_PREFIX + key;
    localStorage.removeItem(storageKey);
  }
}
