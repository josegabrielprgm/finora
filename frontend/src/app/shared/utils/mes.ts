/**
 * Mês de referência no formato `yyyy-MM` (ex.: `2026-11`), igual ao YearMonth do Java.
 * String em vez de Date: não tem fuso horário, compara com `===` e vai direto na URL (`?mes=2026-11`).
 */
export type Mes = string;

function formatar(ano: number, mes: number): Mes {
  return `${ano}-${String(mes).padStart(2, '0')}`;
}

/** Mês da data informada (por padrão, hoje), no fuso local. */
export function mesDe(data: Date = new Date()): Mes {
  return formatar(data.getFullYear(), data.getMonth() + 1);
}

/** Soma (ou subtrai) meses, atravessando a virada do ano: `deslocarMes('2026-01', -1)` → `'2025-12'`. */
export function deslocarMes(mes: Mes, delta: number): Mes {
  const [ano, m] = mes.split('-').map(Number);
  // new Date normaliza mês fora de 0..11 (ex.: mês -1 vira dezembro do ano anterior)
  return mesDe(new Date(ano, m - 1 + delta, 1));
}

/** true se a data ISO (`yyyy-MM-dd`) pertence ao mês. */
export function pertenceAoMes(dataIso: string, mes: Mes): boolean {
  return dataIso.startsWith(`${mes}-`);
}
