package br.com.finora.api.auth.service;

import br.com.finora.api.auth.dto.response.TokenResponse;
import br.com.finora.api.auth.exception.CredenciaisInvalidasException;
import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final String hashFicticio;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.hashFicticio = passwordEncoder.encode("senha-ficticia-para-tempo-constante");
    }

    @Transactional(readOnly = true)
    public TokenResponse autenticar(String email, String senha) {
        String emailNormalizado = email.trim().toLowerCase(Locale.ROOT);
        Optional<Usuario> usuario = usuarioRepository.findByEmail(emailNormalizado);

        if (usuario.isEmpty()) {
            passwordEncoder.matches(senha, hashFicticio);
            throw new CredenciaisInvalidasException();
        }

        if (!passwordEncoder.matches(senha, usuario.get().getSenhaHash())) {
            throw new CredenciaisInvalidasException();
        }

        TokenResponse resposta = tokenService.gerar(usuario.get());
        return resposta;
    }

}
