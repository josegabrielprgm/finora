export type Perfil = 'USER' | 'ADMIN';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
}

export interface CredenciaisLogin {
  email: string;
  senha: string;
}

/** Formato que a API vai devolver no login (o refresh token virá em cookie HttpOnly, não no corpo). */
export interface RespostaLogin {
  accessToken: string;
  usuario: Usuario;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
}
