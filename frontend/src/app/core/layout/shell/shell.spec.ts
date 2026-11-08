import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { AuthService } from '../../services/auth.service';
import { Shell } from './shell';

@Component({ template: '<h1>Página de teste</h1>' })
class PaginaFalsa {}

describe('Shell', () => {
  let fixture: ComponentFixture<Shell>;
  let el: HTMLElement;
  let auth: { sair: ReturnType<typeof vi.fn> };
  let router: Router;
  /** Controla o "tamanho da tela" que o BreakpointObserver informa. */
  let breakpoint: BehaviorSubject<BreakpointState>;

  async function criar(celular: boolean): Promise<void> {
    auth = { sair: vi.fn() };
    breakpoint = new BehaviorSubject<BreakpointState>({ matches: celular, breakpoints: {} });

    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [
        provideRouter([
          { path: 'dashboard', component: PaginaFalsa },
          { path: 'transacoes', component: PaginaFalsa },
          { path: 'categorias', component: PaginaFalsa },
        ]),
        { provide: AuthService, useValue: auth },
        { provide: BreakpointObserver, useValue: { observe: () => breakpoint } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Shell);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function rotulosDoMenu(): string[] {
    return Array.from(el.querySelectorAll('.menu-lateral a.item')).map((a) => a.textContent!.trim());
  }

  describe('no desktop', () => {
    beforeEach(() => criar(false));

    it('mostra o logo e os três itens do menu', () => {
      expect(el.querySelector('.logo')?.textContent).toContain('Finora');
      expect(rotulosDoMenu()).toEqual([
        expect.stringContaining('Dashboard'),
        expect.stringContaining('Transações'),
        expect.stringContaining('Categorias'),
      ]);
    });

    it('não mostra a barra inferior', () => {
      expect(el.querySelector('.barra-inferior')).toBeNull();
    });

    it('destaca o item da rota ativa', async () => {
      await router.navigateByUrl('/transacoes');
      await fixture.whenStable();

      const ativos = el.querySelectorAll('.menu-lateral a.ativo');
      expect(ativos.length).toBe(1);
      expect(ativos[0].textContent).toContain('Transações');
      expect(ativos[0].getAttribute('aria-current')).toBe('page');
    });

    it('renderiza a página filha no conteúdo', async () => {
      await router.navigateByUrl('/dashboard');
      await fixture.whenStable();
      expect(el.querySelector('.conteudo')?.textContent).toContain('Página de teste');
    });

    it('"Sair" encerra a sessão e vai para o login', () => {
      const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      el.querySelector<HTMLButtonElement>('.menu-lateral .sair')!.click();

      expect(auth.sair).toHaveBeenCalled();
      expect(navegar).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('no celular', () => {
    beforeEach(() => criar(true));

    it('mostra a barra inferior só com ícones, com rótulo acessível', () => {
      const links = Array.from(el.querySelectorAll('.barra-inferior a.item'));
      expect(links.map((a) => a.getAttribute('aria-label'))).toEqual(['Dashboard', 'Transações', 'Categorias']);
      expect(links.every((a) => a.querySelector('mat-icon') && !a.querySelector('span'))).toBe(true);
    });

    it('fecha o menu lateral', () => {
      expect(el.querySelector('mat-sidenav')?.classList).not.toContain('mat-drawer-opened');
    });

    it('volta ao menu lateral quando a tela cresce', async () => {
      breakpoint.next({ matches: false, breakpoints: {} });
      await fixture.whenStable();
      expect(el.querySelector('.barra-inferior')).toBeNull();
    });
  });
});
