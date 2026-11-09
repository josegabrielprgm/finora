import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Telas públicas: fora da moldura (sem menu)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/auth/pages/cadastro/cadastro').then((m) => m.Cadastro),
  },

  // Telas privadas: dentro do shell, protegidas uma única vez na rota pai
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'transacoes',
        loadComponent: () => import('./features/transacoes/pages/transacoes/transacoes').then((m) => m.Transacoes),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/categorias/pages/categorias/categorias').then((m) => m.Categorias),
      },
    ],
  },

  // Rota desconhecida volta para a raiz: logado vai ao dashboard, deslogado o guard manda ao login
  { path: '**', redirectTo: '' },
];
