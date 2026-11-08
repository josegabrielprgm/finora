import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it('autentica com as credenciais demo', async () => {
    await firstValueFrom(service.entrar({ email: 'demo@finora.com', senha: 'Senha@123' }));
    expect(service.autenticado()).toBe(true);
    expect(service.usuarioAtual()?.email).toBe('demo@finora.com');
  });

  it('rejeita senha errada com mensagem genérica', async () => {
    await expect(firstValueFrom(service.entrar({ email: 'demo@finora.com', senha: 'x' }))).rejects.toThrow(
      'E-mail ou senha inválidos.'
    );
    expect(service.autenticado()).toBe(false);
  });

  it('sair limpa a sessão', async () => {
    await firstValueFrom(service.entrar({ email: 'demo@finora.com', senha: 'Senha@123' }));
    service.sair();
    expect(service.autenticado()).toBe(false);
  });
});
