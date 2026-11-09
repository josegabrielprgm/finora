package br.com.finora.api.auth.controller;

import br.com.finora.api.auth.dto.request.CadastroRequest;
import br.com.finora.api.auth.dto.response.UsuarioResponse;
import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse cadastrar(@Valid @RequestBody CadastroRequest request) {
        Usuario usuario = usuarioService.cadastrar(request.nome(), request.email(), request.senha());
        UsuarioResponse resposta = UsuarioResponse.converter(usuario);
        return resposta;
    }
}

