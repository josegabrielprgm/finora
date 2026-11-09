package br.com.finora.api.auth.dto.response;

import br.com.finora.api.usuario.entity.Usuario;

import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String nome,
        String email
) {
    public static UsuarioResponse converter(Usuario usuario){
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail()
        );
    }
}
