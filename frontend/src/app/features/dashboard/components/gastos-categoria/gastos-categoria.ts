import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { GastoCategoria } from '../../dashboard.calculos';

/** Barras horizontais com o total de despesas de cada categoria (já ordenado pelo pai). */
@Component({
  imports: [CurrencyPipe, MatCardModule, MatIconModule],
  selector: 'app-gastos-categoria',
  styleUrl: './gastos-categoria.scss',
  templateUrl: './gastos-categoria.html',
})
export class GastosCategoria {
  readonly gastos = input.required<GastoCategoria[]>();
}
