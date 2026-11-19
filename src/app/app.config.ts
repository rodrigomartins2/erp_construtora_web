import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { APP_ROUTES } from 'src/app/app.routes';
import { HttperrorInterceptor } from 'src/app/core/interceptors/httperror.interceptor';
import { PRIMENG_PT_BR } from 'src/app/core/config/primeng-pt-br';
import { primengOverlayConfig } from 'src/app/core/config/primeng-overlay.config';

registerLocaleData(ptBr);

/**
 * Tema Aura com a paleta do design system "Corporate Blue SaaS ERP" (DESIGN.md):
 * primary #087CF5, secondary #0759C9, brand navy #082B63, textos #102348/#64748B.
 */
const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#d7e3ff',
      200: '#abc7ff',
      300: '#7ab0ff',
      400: '#3b93fb',
      500: '#087cf5',
      600: '#0769da',
      700: '#0759c9',
      800: '#00458e',
      900: '#082b63',
      950: '#001b3f'
    },
    formField: {
      borderRadius: '0.5rem'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}'
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}'
        },
        formField: {
          borderColor: '#cbd5e1',
          hoverBorderColor: '#94a3b8',
          focusBorderColor: '{primary.500}',
          color: '#102348',
          placeholderColor: '#94a3b8'
        },
        text: {
          color: '#102348',
          mutedColor: '#64748b'
        },
        content: {
          borderColor: '#e2e8f0'
        }
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      ...primengOverlayConfig,
      ripple: true,
      translation: PRIMENG_PT_BR,
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, components, utilities'
          }
        }
      }
    }),
    MessageService,
    DialogService,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: HTTP_INTERCEPTORS, useClass: HttperrorInterceptor, multi: true },
    { provide: MatPaginatorIntl, useFactory: getPTBRPaginatorIntl }
  ]
};

const ptBRRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);
  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  const amountPages = Math.ceil(length / pageSize);
  return `Registro(s) ${startIndex + 1} de ${endIndex} de ${length}
           - Página(s) ${page + 1} de ${amountPages} `;
};

export function getPTBRPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Itens por página:';
  paginatorIntl.firstPageLabel = 'Primeira página';
  paginatorIntl.previousPageLabel = 'Página Anterior';
  paginatorIntl.nextPageLabel = 'Próxima página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = ptBRRangeLabel;

  return paginatorIntl;
}
