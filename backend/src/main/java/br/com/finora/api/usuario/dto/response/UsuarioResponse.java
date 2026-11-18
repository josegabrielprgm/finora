package br.com.finora.api.usuario.dto.response;

import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String nome,
        String email
) {
}
