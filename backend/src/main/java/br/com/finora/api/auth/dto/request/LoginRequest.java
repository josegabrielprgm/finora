package br.com.finora.api.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "E-mail obrigatório")
        String email,
        @NotBlank(message = "Senha obrigatória")
        String senha
) {
}
