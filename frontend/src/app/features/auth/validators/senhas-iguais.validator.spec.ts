import { FormControl, FormGroup } from '@angular/forms';

import { senhasIguais } from './senhas-iguais.validator';

describe('senhasIguais', () => {
  function grupo(senha: string, confirmar: string): FormGroup {
    return new FormGroup(
      { senha: new FormControl(senha), confirmar: new FormControl(confirmar) },
      { validators: senhasIguais('senha', 'confirmar') }
    );
  }

  it('é válido quando as senhas batem', () => {
    expect(grupo('Senha123', 'Senha123').hasError('senhasDiferentes')).toBe(false);
  });

  it('acusa erro quando as senhas são diferentes', () => {
    expect(grupo('Senha123', 'Outra123').hasError('senhasDiferentes')).toBe(true);
  });

  it('não acusa erro enquanto a confirmação está vazia', () => {
    expect(grupo('Senha123', '').hasError('senhasDiferentes')).toBe(false);
  });
});
