import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

/** Provisório: só confirma o fluxo de login. O saldo do mês entra na próxima tarefa. */
@Component({
  imports: [MatButtonModule],
  selector: 'app-dashboard',
  template: `
    <main class="dashboard">
      <h1>Olá, {{ auth.usuarioAtual()?.nome }}</h1>
      <button mat-stroked-button type="button" (click)="sair()">Sair</button>
    </main>
  `,
  styles: `
    .dashboard {
      padding: 32px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 960px;
      margin: 0 auto;
    }
  `,
})
export class Dashboard {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  sair(): void {
    this.auth.sair();
    this.router.navigate(['/login']);
  }
}
