import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  // Token controlado pelo teste: assim não dependemos do login mock (e da latência dele)
  const token = signal<string | null>(null);
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    token.set(null);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { accessToken: token.asReadonly() } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garante que nenhuma requisição ficou sem ser conferida
    httpMock.verify();
  });

  it('envia o cabeçalho Authorization com token e URL da API', () => {
    token.set('abc123');
    const url = `${environment.apiUrl}/api/usuarios/eu`;

    http.get(url).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('não envia o cabeçalho sem token', () => {
    const url = `${environment.apiUrl}/api/usuarios/eu`;

    http.get(url).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('não envia o cabeçalho para outro site, mesmo com token', () => {
    token.set('abc123');
    const url = 'https://outro-site.com/dados';

    http.get(url).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('não envia o cabeçalho para domínio que só começa com o mesmo texto da API', () => {
    token.set('abc123');
    const url = `${environment.apiUrl}.site-malicioso.com/dados`;

    http.get(url).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
