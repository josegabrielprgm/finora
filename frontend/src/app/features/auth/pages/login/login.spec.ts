import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../../../core/services/auth.service';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let auth: { entrar: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    auth = { entrar: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  function preencher(email: string, senha: string): void {
    const el = fixture.nativeElement as HTMLElement;
    const [inputEmail, inputSenha] = Array.from(el.querySelectorAll('input'));
    inputEmail.value = email;
    inputEmail.dispatchEvent(new Event('input'));
    inputSenha.value = senha;
    inputSenha.dispatchEvent(new Event('input'));
  }

  function enviar(): void {
    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('não chama o serviço com formulário vazio', () => {
    enviar();
    expect(auth.entrar).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Informe o e-mail');
  });

  it('vai para o dashboard com credenciais válidas', () => {
    auth.entrar.mockReturnValue(of({}));
    preencher('demo@finora.com', 'Senha@123');
    enviar();
    expect(auth.entrar).toHaveBeenCalledWith({ email: 'demo@finora.com', senha: 'Senha@123' });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('mostra a mensagem de erro quando o login falha', () => {
    auth.entrar.mockReturnValue(throwError(() => new Error('E-mail ou senha inválidos.')));
    preencher('demo@finora.com', 'errada');
    enviar();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('E-mail ou senha inválidos.');
  });
});
