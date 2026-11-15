package br.com.finora.api.usuario.controller;

import br.com.finora.api.usuario.dto.response.UsuarioResponse;
import br.com.finora.api.usuario.entity.Usuario;
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

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/eu")
    public UsuarioResponse buscarAtual(@AuthenticationPrincipal Jwt jwt) {
        UUID id = UUID.fromString(jwt.getSubject());
        Usuario usuario = usuarioService.buscar(id);
        UsuarioResponse resposta = UsuarioResponse.converter(usuario);
        return resposta;
    }
}
