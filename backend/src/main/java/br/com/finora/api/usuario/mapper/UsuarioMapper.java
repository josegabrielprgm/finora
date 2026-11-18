package br.com.finora.api.usuario.mapper;

import br.com.finora.api.usuario.dto.response.UsuarioResponse;
import br.com.finora.api.usuario.entity.Usuario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioResponse toResponse(Usuario usuario);

}
