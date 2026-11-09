import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { deslocarMes, mesDe } from '../../shared/utils/mes';
import { TransacaoService } from './transacao.service';

describe('TransacaoService', () => {
  let service: TransacaoService;
  const mesAtual = mesDe();

  beforeEach(() => {
    service = TestBed.inject(TransacaoService);
  });

  it('lista as 5 categorias', async () => {
    const categorias = await firstValueFrom(service.listarCategorias());
    expect(categorias.map((c) => c.nome)).toEqual(['Moradia', 'Mercado', 'Transporte', 'Lazer', 'Salário']);
  });

  it('devolve só as transações do mês pedido', async () => {
    const transacoes = await firstValueFrom(service.listarPorMes(mesAtual));
    expect(transacoes.length).toBeGreaterThan(0);
    expect(transacoes.every((t) => t.data.startsWith(`${mesAtual}-`))).toBe(true);
  });

  it('tem dados nos últimos 3 meses (15 transações no total)', async () => {
    const meses = [0, -1, -2].map((d) => deslocarMes(mesAtual, d));
    const listas = await Promise.all(meses.map((m) => firstValueFrom(service.listarPorMes(m))));

    expect(listas.every((l) => l.length > 0)).toBe(true);
    expect(listas.flat()).toHaveLength(15);
  });

  it('devolve lista vazia para mês sem transações', async () => {
    const transacoes = await firstValueFrom(service.listarPorMes(deslocarMes(mesAtual, -12)));
    expect(transacoes).toEqual([]);
  });

  it('devolve cópias: alterar o resultado não muda os dados do "servidor"', async () => {
    const primeira = await firstValueFrom(service.listarPorMes(mesAtual));
    primeira[0].valor = 0;
    primeira.pop();

    const segunda = await firstValueFrom(service.listarPorMes(mesAtual));
    expect(segunda[0].valor).not.toBe(0);
    expect(segunda).toHaveLength(primeira.length + 1);
  });
});
