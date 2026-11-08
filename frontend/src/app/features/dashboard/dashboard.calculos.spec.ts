import { Categoria } from '../../core/models/categoria.model';
import { Transacao } from '../../core/models/transacao.model';
import {
  agruparGastosPorCategoria,
  arredondar,
  calcularResumo,
  CATEGORIA_DESCONHECIDA,
  ultimasTransacoes,
} from './dashboard.calculos';

const categorias: Categoria[] = [
  { id: 1, nome: 'Moradia', icone: 'home' },
  { id: 2, nome: 'Mercado', icone: 'shopping_cart' },
  { id: 5, nome: 'Salário', icone: 'payments' },
];

/** Fábrica de transação: cada teste informa só o que importa para ele. */
function transacao(parcial: Partial<Transacao>): Transacao {
  return { id: 1, descricao: 'X', valor: 0, data: '2026-11-01', tipo: 'DESPESA', categoriaId: 1, ...parcial };
}

describe('arredondar', () => {
  it('corrige o erro de ponto flutuante', () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(arredondar(0.1 + 0.2)).toBe(0.3);
  });
});

describe('calcularResumo', () => {
  it('soma receitas e despesas e calcula o saldo', () => {
    const resumo = calcularResumo([
      transacao({ tipo: 'RECEITA', valor: 5000 }),
      transacao({ tipo: 'DESPESA', valor: 1800 }),
      transacao({ tipo: 'DESPESA', valor: 487.35 }),
    ]);
    expect(resumo).toEqual({ receitas: 5000, despesas: 2287.35, saldo: 2712.65 });
  });

  it('saldo fica negativo quando gasta mais do que ganha', () => {
    const resumo = calcularResumo([
      transacao({ tipo: 'RECEITA', valor: 100 }),
      transacao({ tipo: 'DESPESA', valor: 150.5 }),
    ]);
    expect(resumo.saldo).toBe(-50.5);
  });

  it('mantém centavos exatos em somas que dariam erro de ponto flutuante', () => {
    const resumo = calcularResumo([
      transacao({ tipo: 'DESPESA', valor: 0.1 }),
      transacao({ tipo: 'DESPESA', valor: 0.2 }),
    ]);
    expect(resumo.despesas).toBe(0.3);
  });

  it('zera tudo sem transações', () => {
    expect(calcularResumo([])).toEqual({ receitas: 0, despesas: 0, saldo: 0 });
  });
});

describe('agruparGastosPorCategoria', () => {
  it('soma despesas por categoria, do maior para o menor, ignorando receitas', () => {
    const gastos = agruparGastosPorCategoria(
      [
        transacao({ categoriaId: 2, valor: 100 }),
        transacao({ categoriaId: 1, valor: 600 }),
        transacao({ categoriaId: 2, valor: 300 }),
        transacao({ categoriaId: 5, valor: 9000, tipo: 'RECEITA' }),
      ],
      categorias
    );

    expect(gastos.map((g) => [g.categoria.nome, g.total, g.percentual])).toEqual([
      ['Moradia', 600, 60],
      ['Mercado', 400, 40],
    ]);
  });

  it('usa "Sem categoria" quando a categoria não existe', () => {
    const [gasto] = agruparGastosPorCategoria([transacao({ categoriaId: 99, valor: 10 })], categorias);
    expect(gasto.categoria).toBe(CATEGORIA_DESCONHECIDA);
  });

  it('devolve lista vazia quando não há despesas', () => {
    expect(agruparGastosPorCategoria([transacao({ tipo: 'RECEITA', valor: 10 })], categorias)).toEqual([]);
  });
});

describe('ultimasTransacoes', () => {
  const lista = [
    transacao({ id: 1, data: '2026-11-02' }),
    transacao({ id: 2, data: '2026-11-20' }),
    transacao({ id: 3, data: '2026-11-10' }),
    transacao({ id: 4, data: '2026-11-20' }),
    transacao({ id: 5, data: '2026-11-15' }),
    transacao({ id: 6, data: '2026-11-01', categoriaId: 2 }),
  ];

  it('pega as 5 mais recentes; no mesmo dia, a última cadastrada primeiro', () => {
    expect(ultimasTransacoes(lista, categorias).map((t) => t.id)).toEqual([4, 2, 5, 3, 1]);
  });

  it('respeita a quantidade pedida e junta a categoria', () => {
    const [unica] = ultimasTransacoes([lista[5]], categorias, 1);
    expect(unica.categoria.nome).toBe('Mercado');
  });

  it('não altera a ordem do array original', () => {
    const ids = lista.map((t) => t.id);
    ultimasTransacoes(lista, categorias);
    expect(lista.map((t) => t.id)).toEqual(ids);
  });
});
