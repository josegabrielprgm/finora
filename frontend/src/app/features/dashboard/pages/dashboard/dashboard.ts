import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { TransacaoService } from '../../../../core/services/transacao.service';
import { deslocarMes, Mes, mesDe } from '../../../../shared/utils/mes';
import { GastosCategoria } from '../../components/gastos-categoria/gastos-categoria';
import { ResumoCards } from '../../components/resumo-cards/resumo-cards';
import { SaudacaoSamara } from '../../components/saudacao-samara/saudacao-samara';
import { UltimasTransacoes } from '../../components/ultimas-transacoes/ultimas-transacoes';
import { agruparGastosPorCategoria, calcularResumo, ultimasTransacoes } from '../../dashboard.calculos';

/**
 * Home do app. Este componente "inteligente" busca os dados e calcula;
 * os componentes filhos só exibem o que recebem por input.
 */
@Component({
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, ResumoCards, GastosCategoria, UltimasTransacoes, SaudacaoSamara],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  private readonly transacaoService = inject(TransacaoService);

  protected readonly mes = signal<Mes>(mesDe());

  protected readonly primeiroNome = computed(() => this.auth.usuarioAtual()?.nome.trim().split(/\s+/)[0] ?? '');

  // Categorias: carregadas uma vez (sem params)
  private readonly categorias = rxResource({
    stream: () => this.transacaoService.listarCategorias(),
  });

  // Transações: recarregam sempre que `mes` muda. Se o usuário clicar rápido nas setas,
  // a requisição anterior é cancelada (como um switchMap) e um mês antigo nunca sobrescreve o atual.
  private readonly transacoes = rxResource({
    params: () => this.mes(),
    stream: ({ params: mes }) => this.transacaoService.listarPorMes(mes),
  });

  protected readonly carregando = computed(() => this.transacoes.isLoading() || this.categorias.isLoading());
  protected readonly erro = computed(() => !!(this.transacoes.error() || this.categorias.error()));

  // hasValue() antes de value(): em estado de erro, value() lança exceção
  private readonly listaTransacoes = computed(() => (this.transacoes.hasValue() ? this.transacoes.value() : []));
  private readonly listaCategorias = computed(() => (this.categorias.hasValue() ? this.categorias.value() : []));

  protected readonly vazio = computed(() => this.listaTransacoes().length === 0);
  protected readonly resumo = computed(() => calcularResumo(this.listaTransacoes()));
  protected readonly gastos = computed(() =>
    agruparGastosPorCategoria(this.listaTransacoes(), this.listaCategorias())
  );
  protected readonly ultimas = computed(() => ultimasTransacoes(this.listaTransacoes(), this.listaCategorias()));

  voltarMes(): void {
    this.mes.update((m) => deslocarMes(m, -1));
  }

  avancarMes(): void {
    this.mes.update((m) => deslocarMes(m, 1));
  }

  recarregar(): void {
    this.categorias.reload();
    this.transacoes.reload();
  }
}
