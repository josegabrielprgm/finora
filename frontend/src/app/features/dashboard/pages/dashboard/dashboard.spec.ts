import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { vi } from 'vitest';

import { Categoria } from '../../../../core/models/categoria.model';
import { Transacao } from '../../../../core/models/transacao.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TransacaoService } from '../../../../core/services/transacao.service';
import { deslocarMes, mesDe } from '../../../../shared/utils/mes';
import { Dashboard } from './dashboard';

registerLocaleData(localePt);

const categorias: Categoria[] = [
  { id: 1, nome: 'Moradia', icone: 'home' },
  { id: 5, nome: 'Salário', icone: 'payments' },
];

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let el: HTMLElement;
  let service: { listarCategorias: ReturnType<typeof vi.fn>; listarPorMes: ReturnType<typeof vi.fn> };
  const mesAtual = mesDe();

  const doMesAtual: Transacao[] = [
    { id: 1, descricao: 'Salário', valor: 5000, data: `${mesAtual}-05`, tipo: 'RECEITA', categoriaId: 5 },
    { id: 2, descricao: 'Aluguel', valor: 1234.56, data: `${mesAtual}-06`, tipo: 'DESPESA', categoriaId: 1 },
  ];

  /** `esperar = false` não aguarda o carregamento (whenStable esperaria a resposta pendente). */
  async function criar(listarPorMes: (mes: string) => unknown, esperar = true): Promise<void> {
    service = { listarCategorias: vi.fn(() => of(categorias)), listarPorMes: vi.fn(listarPorMes) };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: TransacaoService, useValue: service },
        { provide: AuthService, useValue: { usuarioAtual: signal({ nome: 'Ana Maria Souza' }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    el = fixture.nativeElement as HTMLElement;
    if (esperar) await fixture.whenStable();
    else fixture.detectChanges();
  }

  it('cumprimenta pelo primeiro nome', async () => {
    await criar(() => of(doMesAtual));
    expect(el.querySelector('h1')?.textContent).toContain('Olá, Ana');
    expect(el.querySelector('h1')?.textContent).not.toContain('Maria');
  });

  it('mostra o resumo do mês formatado em reais', async () => {
    await criar(() => of(doMesAtual));
    const texto = el.querySelector('app-resumo-cards')!.textContent!.replace(/\s/g, ' ');
    expect(texto).toContain('R$ 3.765,44'); // saldo
    expect(texto).toContain('R$ 5.000,00');
    expect(texto).toContain('R$ 1.234,56');
  });

  it('tem um único botão filled', async () => {
    await criar(() => of(doMesAtual));
    const filled = el.querySelectorAll('[matButton="filled"]');
    expect(filled).toHaveLength(1);
    expect(filled[0].textContent).toContain('Nova transação');
  });

  it('mostra o skeleton enquanto carrega', async () => {
    const resposta = new Subject<Transacao[]>();
    await criar(() => resposta, false);
    expect(el.querySelector('.esqueleto')).not.toBeNull();

    resposta.next(doMesAtual);
    await fixture.whenStable();
    expect(el.querySelector('.esqueleto')).toBeNull();
    expect(el.querySelector('app-resumo-cards')).not.toBeNull();
  });

  it('mostra o estado vazio em mês sem transações', async () => {
    await criar(() => of([]));
    expect(el.querySelector('.estado')?.textContent).toContain('Nenhuma transação');
    expect(el.querySelector('app-resumo-cards')).toBeNull();
  });

  it('as setas trocam o mês e recarregam os dados', async () => {
    await criar((mes) => of(mes === mesAtual ? doMesAtual : []));
    const [anterior, proximo] = Array.from(el.querySelectorAll<HTMLButtonElement>('.seletor-mes button'));

    anterior.click();
    await fixture.whenStable();
    expect(service.listarPorMes).toHaveBeenLastCalledWith(deslocarMes(mesAtual, -1));
    expect(el.querySelector('.estado')).not.toBeNull();

    proximo.click();
    await fixture.whenStable();
    expect(service.listarPorMes).toHaveBeenLastCalledWith(mesAtual);
    expect(el.querySelector('app-resumo-cards')).not.toBeNull();
  });
});
