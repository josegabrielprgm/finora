package br.com.finora.api.usuario.controller;

import br.com.finora.api.usuario.dto.response.UsuarioResponse;
import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.mapper.UsuarioMapper;
import br.com.finora.api.usuario.service.UsuarioService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioMapper mapper;

    public UsuarioController(UsuarioService usuarioService, UsuarioMapper mapper) {
        this.usuarioService = usuarioService;
        this.mapper = mapper;
    }

    @GetMapping("/eu")
    public UsuarioResponse buscarAtual(@AuthenticationPrincipal Jwt jwt) {
        UUID id = UUID.fromString(jwt.getSubject());
        Usuario usuario = usuarioService.buscar(id);

        return mapper.toResponse(usuario);
    }
}
