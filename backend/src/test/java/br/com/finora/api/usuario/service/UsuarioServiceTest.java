package br.com.finora.api.usuario.service;

import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.exception.EmailJaCadastradoException;
import br.com.finora.api.usuario.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {
    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    @DisplayName("Deve salvar o nome sem espaços e o e-mail em minúsculas")
    void cadastrarNormalizaDados() {
        when(usuarioRepository.existsByEmail("jose@finora.com")).thenReturn(false);
        when(passwordEncoder.encode("SenhaForte123")).thenReturn("hash-gerado");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        Usuario usuario = usuarioService.cadastrar(" José ", "   JOSE@finora.com  ", "SenhaForte123");

        assertEquals("José", usuario.getNome());
        assertEquals("jose@finora.com", usuario.getEmail());

    }

    @Test
    @DisplayName("Deve salvar a senha com hash")
    void cadastrarSalvaHash() {
        when(usuarioRepository.existsByEmail("jose@finora.com")).thenReturn(false);
        when(passwordEncoder.encode("SenhaForte123")).thenReturn("hash-gerado");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        Usuario usuario = usuarioService.cadastrar(" José ", "   JOSE@finora.com  ", "SenhaForte123");

        assertEquals("hash-gerado", usuario.getSenhaHash());

        assertNotEquals("SenhaForte123", usuario.getSenhaHash());
    }

    @Test
    @DisplayName("Deve recusar e-mail já cadastrado e não salvar nada")
    void cadastrarRecusaEmailDuplicado() {
        when(usuarioRepository.existsByEmail("jose@finora.com")).thenReturn(true);

        assertThrows(EmailJaCadastradoException.class,
                () -> usuarioService.cadastrar("José", "JOSE@finora.com", "SenhaForte123"));

        verify(usuarioRepository, never()).save(any());
    }

}
