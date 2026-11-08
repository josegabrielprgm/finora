export type TipoTransacao = 'RECEITA' | 'DESPESA';

export interface Transacao {
  id: number;
  descricao: string;
  /** Sempre positivo: o sinal vem do `tipo`. No back-end será BigDecimal. */
  valor: number;
  /** Data no formato ISO `yyyy-MM-dd`, como a API vai mandar (LocalDate do Java). */
  data: string;
  tipo: TipoTransacao;
  categoriaId: number;
}
