import { computed, Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';

import { CredenciaisLogin, RespostaLogin, Usuario } from '../models/auth.model';

/** Usuário de demonstração enquanto a API não existe. */
const USUARIO_MOCK: Usuario = { id: 1, nome: 'Usuário Demo', email: 'demo@finora.com', perfil: 'USER' };
const SENHA_MOCK = 'Senha@123';

/**
 * Autenticação do app (instância única, providedIn: 'root').
 *
 * Por enquanto usa dados mock. Quando a API existir, só o corpo de `entrar`
 * muda para `this.http.post<RespostaLogin>('/api/auth/login', credenciais)`;
 * as telas continuam iguais porque dependem só da assinatura (Observable).
 *
 * O access token fica em memória (signal), não no localStorage:
 * localStorage pode ser lido por qualquer script injetado (XSS).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly token = signal<string | null>(null);
  private readonly usuario = signal<Usuario | null>(null);

  readonly usuarioAtual = this.usuario.asReadonly();
  readonly autenticado = computed(() => this.token() !== null);

  entrar(credenciais: CredenciaisLogin): Observable<RespostaLogin> {
    const valido =
      credenciais.email.trim().toLowerCase() === USUARIO_MOCK.email && credenciais.senha === SENHA_MOCK;

    if (!valido) {
      // Mensagem genérica de propósito: não revelar se o e-mail existe (evita enumeração de usuários)
      return throwError(() => new Error('E-mail ou senha inválidos.')).pipe(delay(600));
    }

    const resposta: RespostaLogin = { accessToken: 'token-mock', usuario: USUARIO_MOCK };
    return of(resposta).pipe(
      delay(600), // simula a latência da rede para testar o estado de "carregando"
      tap((r) => {
        this.token.set(r.accessToken);
        this.usuario.set(r.usuario);
      })
    );
  }

  sair(): void {
    this.token.set(null);
    this.usuario.set(null);
  }
}
