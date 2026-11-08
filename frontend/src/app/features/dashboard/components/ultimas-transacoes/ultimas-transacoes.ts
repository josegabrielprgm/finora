import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TransacaoDetalhada } from '../../dashboard.calculos';

/** As transações mais recentes do mês, com link para a lista completa. */
@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  selector: 'app-ultimas-transacoes',
  styleUrl: './ultimas-transacoes.scss',
  templateUrl: './ultimas-transacoes.html',
})
export class UltimasTransacoes {
  readonly transacoes = input.required<TransacaoDetalhada[]>();
}
