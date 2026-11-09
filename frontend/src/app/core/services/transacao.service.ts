import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { deslocarMes, Mes, mesDe, pertenceAoMes } from '../../shared/utils/mes';
import { Categoria } from '../models/categoria.model';
import { TipoTransacao, Transacao } from '../models/transacao.model';

/** Latência simulada da rede, para testar os estados de "carregando". */
const LATENCIA_MS = 600;

const CATEGORIAS: Categoria[] = [
  { id: 1, nome: 'Moradia', icone: 'home' },
  { id: 2, nome: 'Mercado', icone: 'shopping_cart' },
  { id: 3, nome: 'Transporte', icone: 'directions_car' },
  { id: 4, nome: 'Lazer', icone: 'sports_esports' },
  { id: 5, nome: 'Salário', icone: 'payments' },
];

/** [meses atrás, dia, descrição, valor, tipo, categoriaId]. Dias até 28 para caber em qualquer mês. */
type LinhaMock = [number, number, string, number, TipoTransacao, number];

const LINHAS: LinhaMock[] = [
  // Mês atual
  [0, 5, 'Salário', 6500, 'RECEITA', 5],
  [0, 6, 'Aluguel', 1800, 'DESPESA', 1],
  [0, 8, 'Supermercado', 487.35, 'DESPESA', 2],
  [0, 10, 'Combustível', 220, 'DESPESA', 3],
  [0, 12, 'Cinema', 64.9, 'DESPESA', 4],
  [0, 15, 'Conta de luz', 189.47, 'DESPESA', 1],
  // Mês passado
  [1, 5, 'Salário', 6500, 'RECEITA', 5],
  [1, 6, 'Aluguel', 1800, 'DESPESA', 1],
  [1, 9, 'Feira', 132.8, 'DESPESA', 2],
  [1, 14, 'Uber', 47.6, 'DESPESA', 3],
  [1, 20, 'Show', 250, 'DESPESA', 4],
  [1, 22, 'Freela de design', 1200, 'RECEITA', 5],
  // Dois meses atrás
  [2, 5, 'Salário', 6500, 'RECEITA', 5],
  [2, 6, 'Aluguel', 1800, 'DESPESA', 1],
  [2, 18, 'Supermercado', 612.4, 'DESPESA', 2],
];

/**
 * Transações do usuário logado (instância única, providedIn: 'root').
 *
 * Mesmo padrão do AuthService: dados mock em memória e métodos que devolvem Observable.
 * Quando a API existir, só o corpo muda, por exemplo:
 *   `listarPorMes(mes)` → `http.get<Transacao[]>('/api/transacoes', { params: { mes } })`
 * O filtro por usuário será do back-end (pelo JWT), nunca de um parâmetro do front (IDOR).
 *
 * As datas mock são relativas ao mês atual, para o dashboard nunca abrir vazio.
 */
@Injectable({ providedIn: 'root' })
export class TransacaoService {
  private readonly transacoes: Transacao[] = this.gerarMock(mesDe());

  listarCategorias(): Observable<Categoria[]> {
    return of(structuredClone(CATEGORIAS)).pipe(delay(LATENCIA_MS));
  }

  /** Transações do mês, como o servidor devolveria (cópia: a tela não altera o "banco"). */
  listarPorMes(mes: Mes): Observable<Transacao[]> {
    const doMes = this.transacoes.filter((t) => pertenceAoMes(t.data, mes));
    return of(structuredClone(doMes)).pipe(delay(LATENCIA_MS));
  }

  private gerarMock(mesAtual: Mes): Transacao[] {
    return LINHAS.map(([mesesAtras, dia, descricao, valor, tipo, categoriaId], i) => ({
      id: i + 1,
      descricao,
      valor,
      data: `${deslocarMes(mesAtual, -mesesAtras)}-${String(dia).padStart(2, '0')}`,
      tipo,
      categoriaId,
    }));
  }
}
