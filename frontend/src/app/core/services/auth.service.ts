import { computed, Injectable, signal } from '@angular/core';
import { delay, Observable, of, tap, throwError } from 'rxjs';

import { CredenciaisLogin, DadosCadastro, RespostaLogin, Usuario } from '../models/auth.model';

/** Usuário mock com senha: só existe enquanto a API não existe (no back-end a senha vira hash BCrypt). */
interface UsuarioMock extends Usuario {
  senha: string;
}

/** Latência simulada da rede, para testar os estados de "carregando". */
const LATENCIA_MS = 600;

/**
 * Autenticação do app (instância única, providedIn: 'root').
 *
 * Por enquanto usa dados mock em memória. Quando a API existir, só o corpo
 * dos métodos muda para chamadas `HttpClient` (ex.: `http.post('/api/auth/login', ...)`);
 * as telas continuam iguais porque dependem só das assinaturas (Observable).
 *
 * O access token fica em memória (signal), não no localStorage:
 * localStorage pode ser lido por qualquer script injetado (XSS).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarios: UsuarioMock[] = [
    { id: 1, nome: 'Usuário Demo', email: 'demo@finora.com', perfil: 'USER', senha: 'Senha@123' },
  ];

  private readonly token = signal<string | null>(null);
  private readonly usuario = signal<Usuario | null>(null);

  readonly usuarioAtual = this.usuario.asReadonly();
  readonly autenticado = computed(() => this.token() !== null);

  entrar(credenciais: CredenciaisLogin): Observable<RespostaLogin> {
    const encontrado = this.usuarios.find(
      (u) => u.email === this.normalizarEmail(credenciais.email) && u.senha === credenciais.senha
    );

    if (!encontrado) {
      // Mensagem genérica de propósito: não revelar se o e-mail existe (evita enumeração de usuários)
      return throwError(() => new Error('E-mail ou senha inválidos.')).pipe(delay(LATENCIA_MS));
    }

    const { senha, ...usuario } = encontrado; // nunca deixar a senha sair do "back-end"
    const resposta: RespostaLogin = { accessToken: 'token-mock', usuario };
    return of(resposta).pipe(
      delay(LATENCIA_MS),
      tap((r) => {
        this.token.set(r.accessToken);
        this.usuario.set(r.usuario);
      })
    );
  }

  /** Cria a conta. Não autentica: o usuário faz login em seguida, como na API real. */
  cadastrar(dados: DadosCadastro): Observable<Usuario> {
    const email = this.normalizarEmail(dados.email);

    if (this.usuarios.some((u) => u.email === email)) {
      return throwError(() => new Error('Este e-mail já está cadastrado.')).pipe(delay(LATENCIA_MS));
    }

    const novo: UsuarioMock = {
      id: this.usuarios.length + 1,
      nome: dados.nome.trim(),
      email,
      perfil: 'USER', // perfil sempre definido pelo servidor, nunca pelo formulário
      senha: dados.senha,
    };
    this.usuarios.push(novo);

    const { senha, ...usuario } = novo;
    return of(usuario).pipe(delay(LATENCIA_MS));
  }

  sair(): void {
    this.token.set(null);
    this.usuario.set(null);
  }

  private normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
