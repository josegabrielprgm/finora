import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../../services/auth.service';

interface ItemMenu {
  rota: string;
  rotulo: string;
  icone: string;
}

/**
 * Moldura das telas privadas: menu lateral (desktop) ou barra inferior (celular)
 * em volta do <router-outlet />. As telas filhas não sabem que o menu existe.
 */
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatIconModule],
  selector: 'app-shell',
  styleUrl: './shell.scss',
  templateUrl: './shell.html',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly itens: ItemMenu[] = [
    { rota: '/dashboard', rotulo: 'Dashboard', icone: 'dashboard' },
    { rota: '/transacoes', rotulo: 'Transações', icone: 'receipt_long' },
    { rota: '/categorias', rotulo: 'Categorias', icone: 'category' },
  ];

  /** true em celular (retrato ou paisagem). Observable do CDK convertido em signal. */
  protected readonly celular = toSignal(
    inject(BreakpointObserver)
      .observe(Breakpoints.Handset)
      .pipe(map((estado) => estado.matches)),
    { initialValue: false }
  );

  sair(): void {
    this.auth.sair();
    this.router.navigate(['/login']);
  }
}
