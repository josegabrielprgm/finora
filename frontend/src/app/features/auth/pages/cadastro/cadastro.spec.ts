import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../../../core/services/auth.service';
import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  let fixture: ComponentFixture<Cadastro>;
  let auth: { cadastrar: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    auth = { cadastrar: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();

    fixture = TestBed.createComponent(Cadastro);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  const el = () => fixture.nativeElement as HTMLElement;

  function preencher(nome: string, email: string, senha: string, confirmar: string): void {
    const inputs = Array.from(el().querySelectorAll('input'));
    [nome, email, senha, confirmar].forEach((valor, i) => {
      inputs[i].value = valor;
      inputs[i].dispatchEvent(new Event('input'));
      inputs[i].dispatchEvent(new Event('blur'));
    });
  }

  function enviar(): void {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('não chama o serviço com formulário vazio', () => {
    enviar();
    expect(auth.cadastrar).not.toHaveBeenCalled();
    expect(el().textContent).toContain('Informe seu nome');
  });

  it('recusa senha sem número', () => {
    preencher('Ana', 'ana@email.com', 'somenteletras', 'somenteletras');
    enviar();
    expect(auth.cadastrar).not.toHaveBeenCalled();
    expect(el().textContent).toContain('Use letras e números');
  });

  it('acusa senhas diferentes', () => {
    preencher('Ana', 'ana@email.com', 'Senha123', 'Senha999');
    enviar();
    expect(auth.cadastrar).not.toHaveBeenCalled();
    expect(el().textContent).toContain('As senhas não conferem');
  });

  it('envia sem a confirmação e volta para o login', () => {
    auth.cadastrar.mockReturnValue(of({}));
    preencher('Ana', 'ana@email.com', 'Senha123', 'Senha123');
    enviar();
    expect(auth.cadastrar).toHaveBeenCalledWith({ nome: 'Ana', email: 'ana@email.com', senha: 'Senha123' });
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { cadastro: 'sucesso' } });
  });

  it('mostra o erro do serviço', () => {
    auth.cadastrar.mockReturnValue(throwError(() => new Error('Este e-mail já está cadastrado.')));
    preencher('Ana', 'demo@finora.com', 'Senha123', 'Senha123');
    enviar();
    expect(el().textContent).toContain('Este e-mail já está cadastrado.');
  });
});
