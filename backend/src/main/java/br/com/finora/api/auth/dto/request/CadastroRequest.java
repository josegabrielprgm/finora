package br.com.finora.api.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        @NotBlank(message = "Nome obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @NotBlank(message = "Email obrigatório")
        @Size(max = 255, message = "O e-mail deve ter no máximo 255 caracteres")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "Senha obrigatória")
        @Size(min = 8, max = 64, message = "A senha deve ter entre 8 e 64 caracteres")
        String senha) {
}
