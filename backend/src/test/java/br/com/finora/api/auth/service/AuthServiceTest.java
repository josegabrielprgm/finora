package br.com.finora.api.auth.service;

import br.com.finora.api.auth.dto.response.TokenResponse;
import br.com.finora.api.auth.exception.CredenciaisInvalidasException;
import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Deve gerar o token com credenciais válidas")
    void autenticarGeraToken() {
        Usuario usuario = new Usuario("José", "jose@finora.com", "hash-gerado");
        TokenResponse token = new TokenResponse("token-gerado", "Bearer", 900);
        when(usuarioRepository.findByEmail("jose@finora.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("SenhaForte123", "hash-gerado")).thenReturn(true);
        when(tokenService.gerar(usuario)).thenReturn(token);

        TokenResponse resposta = authService.autenticar("  JOSE@finora.com ", "SenhaForte123");

        assertEquals(token, resposta);
    }

    @Test
    @DisplayName("Deve recusar senha errada sem gerar token")
    void autenticarRecusaSenhaErrada() {
        Usuario usuario = new Usuario("José", "jose@finora.com", "hash-gerado");
        when(usuarioRepository.findByEmail("jose@finora.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("SenhaErrada", "hash-gerado")).thenReturn(false);

        assertThrows(CredenciaisInvalidasException.class,
                () -> authService.autenticar("jose@finora.com", "SenhaErrada"));

        verify(tokenService, never()).gerar(any());
    }

    @Test
    @DisplayName("Deve recusar e-mail inexistente e ainda conferir a senha, para o tempo ser o mesmo")
    void autenticarRecusaEmailInexistente() {
        when(usuarioRepository.findByEmail("ninguem@finora.com")).thenReturn(Optional.empty());

        assertThrows(CredenciaisInvalidasException.class,
                () -> authService.autenticar("ninguem@finora.com", "SenhaForte123"));

        verify(passwordEncoder).matches(eq("SenhaForte123"), any());
        verify(tokenService, never()).gerar(any());
    }
}