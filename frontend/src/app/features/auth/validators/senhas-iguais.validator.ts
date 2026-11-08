import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de grupo: compara dois campos do mesmo formulário.
 * Fica no grupo (e não no campo) porque precisa enxergar os dois valores.
 */
export function senhasIguais(campo: string, confirmacao: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const senha = grupo.get(campo)?.value;
    const confirmar = grupo.get(confirmacao)?.value;
    return senha && confirmar && senha !== confirmar ? { senhasDiferentes: true } : null;
  };
}
