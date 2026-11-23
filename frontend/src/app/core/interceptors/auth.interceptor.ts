import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Adiciona "Authorization: Bearer <token>" nas requisições para a nossa API.
 *
 * O token só vai para a URL da API: mandar para outro site (CDN, API externa)
 * entregaria a credencial do usuário a terceiros.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).accessToken();

  if (!token || !ehUrlDaApi(req.url)) {
    return next(req);
  }

  const reqComToken = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(reqComToken);
};

/**
 * Compara com "apiUrl/" e não só com "apiUrl": um startsWith simples aceitaria
 * "http://localhost:8080.site-malicioso.com", que começa com o mesmo texto.
 */
function ehUrlDaApi(url: string): boolean {
  const api = environment.apiUrl;
  return url === api || url.startsWith(`${api}/`);
}
