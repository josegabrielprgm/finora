import { Component, inject } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';

/** Provisório: o saldo do mês e os totais por categoria entram na próxima tarefa. */
@Component({
  selector: 'app-dashboard',
  template: `
    <main class="pagina">
      <h1>Olá, {{ auth.usuarioAtual()?.nome }}</h1>
    </main>
  `,
  styles: `
    .pagina {
      padding: 32px 24px;
    }
  `,
})
export class Dashboard {
  protected readonly auth = inject(AuthService);
}
