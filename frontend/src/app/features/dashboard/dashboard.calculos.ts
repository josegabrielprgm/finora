import { Categoria } from '../../core/models/categoria.model';
import { Transacao } from '../../core/models/transacao.model';

/**
 * Cálculos do dashboard como funções puras: mesma entrada, mesma saída, sem Angular.
 * Assim são testadas sem TestBed, e o componente só as chama dentro de `computed`.
 */

export interface ResumoMes {
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface GastoCategoria {
  categoria: Categoria;
  total: number;
  /** Fatia do total de despesas do mês, de 0 a 100. */
  percentual: number;
}

export interface TransacaoDetalhada extends Transacao {
  categoria: Categoria;
}

/** Usada quando a transação aponta para uma categoria que não veio (ex.: apagada). */
export const CATEGORIA_DESCONHECIDA: Categoria = { id: 0, nome: 'Sem categoria', icone: 'help' };

/**
 * Arredonda para centavos. Number é ponto flutuante: 0.1 + 0.2 = 0.30000000000000004.
 * Somas de dinheiro acumulam esse erro; no back-end isso some com BigDecimal.
 */
export function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function calcularResumo(transacoes: Transacao[]): ResumoMes {
  let receitas = 0;
  let despesas = 0;
  for (const t of transacoes) {
    if (t.tipo === 'RECEITA') receitas += t.valor;
    else despesas += t.valor;
  }
  return {
    receitas: arredondar(receitas),
    despesas: arredondar(despesas),
    saldo: arredondar(receitas - despesas),
  };
}

/** Total de despesas por categoria, do maior para o menor. Receitas ficam de fora. */
export function agruparGastosPorCategoria(transacoes: Transacao[], categorias: Categoria[]): GastoCategoria[] {
  const totais = new Map<number, number>();
  for (const t of transacoes) {
    if (t.tipo === 'DESPESA') totais.set(t.categoriaId, (totais.get(t.categoriaId) ?? 0) + t.valor);
  }

  const totalDespesas = [...totais.values()].reduce((soma, v) => soma + v, 0);

  return [...totais.entries()]
    .map(([categoriaId, total]) => ({
      categoria: buscarCategoria(categorias, categoriaId),
      total: arredondar(total),
      percentual: Math.round((total / totalDespesas) * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

/** As `quantidade` transações mais recentes (por data e, no mesmo dia, pela última cadastrada). */
export function ultimasTransacoes(
  transacoes: Transacao[],
  categorias: Categoria[],
  quantidade = 5
): TransacaoDetalhada[] {
  return [...transacoes] // copia: sort altera o array original
    .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
    .slice(0, quantidade)
    .map((t) => ({ ...t, categoria: buscarCategoria(categorias, t.categoriaId) }));
}

function buscarCategoria(categorias: Categoria[], id: number): Categoria {
  return categorias.find((c) => c.id === id) ?? CATEGORIA_DESCONHECIDA;
}
