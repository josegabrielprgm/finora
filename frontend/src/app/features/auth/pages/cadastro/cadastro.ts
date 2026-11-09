import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { senhasIguais } from '../../validators/senhas-iguais.validator';

/** Pelo menos uma letra e um número. */
const SENHA_FORTE = /^(?=.*[A-Za-z])(?=.*\d).+$/;

/**
 * O erro "senhas diferentes" fica no grupo, não no campo. Por padrão o Material só
 * pinta o campo de vermelho quando o PRÓPRIO campo é inválido; este matcher faz
 * a confirmação também acender quando o grupo acusa a diferença.
 */
class ConfirmacaoErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const tocado = !!control && (control.touched || !!form?.submitted);
    return tocado && (!!control?.invalid || !!form?.hasError('senhasDiferentes'));
  }
}

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-cadastro',
  styleUrl: '../../auth-pagina.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      // 72 = limite do BCrypt (bytes além disso são ignorados no hash)
      senha: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(72), Validators.pattern(SENHA_FORTE)],
      ],
      confirmarSenha: ['', [Validators.required]],
    },
    { validators: senhasIguais('senha', 'confirmarSenha') }
  );

  protected readonly confirmacaoMatcher = new ConfirmacaoErrorStateMatcher();
  protected readonly senhaVisivel = signal(false);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);

  alternarSenha(): void {
    this.senhaVisivel.update((v) => !v);
  }

  cadastrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);

    // confirmarSenha é só da tela: não vai para a API
    const { nome, email, senha } = this.form.getRawValue();

    this.auth.cadastrar({ nome, email, senha }).subscribe({
      next: () => this.router.navigate(['/login'], { queryParams: { cadastro: 'sucesso' } }),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
}
