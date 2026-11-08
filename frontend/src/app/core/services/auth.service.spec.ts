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

describe('AuthService.cadastrar', () => {
  let service: AuthService;

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it('cria a conta como USER e permite login depois', async () => {
    const usuario = await firstValueFrom(
      service.cadastrar({ nome: ' Ana ', email: 'Ana@Email.com', senha: 'Senha123' })
    );
    expect(usuario).toEqual({ id: 2, nome: 'Ana', email: 'ana@email.com', perfil: 'USER' });
    expect(service.autenticado()).toBe(false);

    await firstValueFrom(service.entrar({ email: 'ana@email.com', senha: 'Senha123' }));
    expect(service.autenticado()).toBe(true);
  });

  it('não devolve a senha', async () => {
    const usuario = await firstValueFrom(
      service.cadastrar({ nome: 'Ana', email: 'ana@email.com', senha: 'Senha123' })
    );
    expect(usuario).not.toHaveProperty('senha');
  });

  it('rejeita e-mail já cadastrado', async () => {
    await expect(
      firstValueFrom(service.cadastrar({ nome: 'X', email: 'DEMO@finora.com', senha: 'Senha123' }))
    ).rejects.toThrow('Este e-mail já está cadastrado.');
  });
});
