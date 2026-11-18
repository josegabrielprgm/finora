package br.com.finora.api.auth.controller;

import br.com.finora.api.auth.dto.request.CadastroRequest;
import br.com.finora.api.auth.dto.request.LoginRequest;
import br.com.finora.api.auth.dto.response.TokenResponse;
import br.com.finora.api.auth.service.AuthService;
import br.com.finora.api.usuario.dto.response.UsuarioResponse;
import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.mapper.UsuarioMapper;
import br.com.finora.api.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthService authService;
    private final UsuarioMapper usuarioMapper;

    public AuthController(UsuarioService usuarioService, AuthService authService, UsuarioMapper usuarioMapper) {
        this.usuarioService = usuarioService;
        this.authService = authService;
        this.usuarioMapper = usuarioMapper;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse cadastrar(@Valid @RequestBody CadastroRequest request) {
        Usuario usuario = usuarioService.cadastrar(request.nome(), request.email(), request.senha());
        return usuarioMapper.converter(usuario);
    }


    @PostMapping("/login")
    public TokenResponse entrar(@Valid @RequestBody LoginRequest request) {
        TokenResponse resposta = authService.autenticar(request.email(), request.senha());
        return resposta;
    }

}

