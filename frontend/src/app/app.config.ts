import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// Regras de formatação do português (R$ 1.234,56, nomes de meses...). Sem isso o LOCALE_ID abaixo quebra os pipes.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // HttpClient com o interceptor que coloca o token nas chamadas à API
    provideHttpClient(withInterceptors([authInterceptor])),
    // Locale padrão dos pipes currency, date e number
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    // Faz o <mat-icon> usar a fonte Material Symbols (carregada no index.html)
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } }
  ]
};
