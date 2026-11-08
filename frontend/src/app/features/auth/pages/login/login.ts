import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

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
  selector: 'app-login',
  styleUrl: '../../auth-pagina.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Veio da tela de cadastro com sucesso (/login?cadastro=sucesso). */
  protected readonly cadastroConcluido =
    inject(ActivatedRoute).snapshot.queryParamMap.get('cadastro') === 'sucesso';

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  protected readonly senhaVisivel = signal(false);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);

  alternarSenha(): void {
    this.senhaVisivel.update((v) => !v);
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // mostra os erros de campos que o usuário nem tocou
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);

    this.auth.entrar(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
}
