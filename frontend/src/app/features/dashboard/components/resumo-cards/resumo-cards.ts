import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ResumoMes } from '../../dashboard.calculos';

/** Saldo, receitas e despesas do mês. Só exibe: os números chegam prontos. */
@Component({
  imports: [CurrencyPipe, MatCardModule, MatIconModule],
  selector: 'app-resumo-cards',
  styleUrl: './resumo-cards.scss',
  templateUrl: './resumo-cards.html',
})
export class ResumoCards {
  readonly resumo = input.required<ResumoMes>();
}
