import { deslocarMes, mesDe, pertenceAoMes } from './mes';

describe('mes', () => {
  it('mesDe formata ano e mês com dois dígitos, no fuso local', () => {
    expect(mesDe(new Date(2026, 0, 31))).toBe('2026-01');
    expect(mesDe(new Date(2026, 10, 1))).toBe('2026-11');
  });

  it('deslocarMes atravessa a virada do ano nos dois sentidos', () => {
    expect(deslocarMes('2026-01', -1)).toBe('2025-12');
    expect(deslocarMes('2025-12', 1)).toBe('2026-01');
    expect(deslocarMes('2026-11', -2)).toBe('2026-09');
  });

  it('pertenceAoMes compara pelo prefixo yyyy-MM-', () => {
    expect(pertenceAoMes('2026-11-08', '2026-11')).toBe(true);
    expect(pertenceAoMes('2026-10-31', '2026-11')).toBe(false);
  });
});
