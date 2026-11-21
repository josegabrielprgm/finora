package br.com.finora.api.usuario.controller;

import br.com.finora.api.config.security.SecurityConfig;
import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.mapper.UsuarioMapperImpl;
import br.com.finora.api.usuario.service.UsuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsuarioController.class)
@Import({SecurityConfig.class, UsuarioMapperImpl.class})
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    @DisplayName("Deve devolver os dados do usuário dono do token")
    void buscarAtualResponde200() throws Exception {
        UUID id = UUID.randomUUID();
        Usuario usuario = new Usuario("José", "jose@finora.com", "hash-gerado");
        when(usuarioService.buscar(id)).thenReturn(usuario);

        mockMvc.perform(get("/api/usuarios/eu")
                        .with(jwt().jwt(token -> token.subject(id.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("jose@finora.com"))
                .andExpect(jsonPath("$.senhaHash").doesNotExist());
    }

    @Test
    @DisplayName("Deve responder 401 sem token e não buscar nenhum usuário")
    void buscarAtualResponde401() throws Exception {
        mockMvc.perform(get("/api/usuarios/eu"))
                .andExpect(status().isUnauthorized());

        verify(usuarioService, never()).buscar(any());
    }
}