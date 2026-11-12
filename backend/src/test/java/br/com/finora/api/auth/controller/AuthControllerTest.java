package br.com.finora.api.auth.controller;

import br.com.finora.api.config.SecurityConfig;
import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.exception.EmailJaCadastradoException;
import br.com.finora.api.usuario.service.UsuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @Test
    @DisplayName("Deve cadastrar e responder 201 sem expor a senha")
    void cadastrarResponde201() throws Exception {
        Usuario usuario = new Usuario("José", "jose@finora.com", "hash-gerado");
        when(usuarioService.cadastrar(any(), any(), any())).thenReturn(usuario);

        String corpo = """
                {"nome": "José", "email": "jose@finora.com", "senha": "SenhaForte123"}
                """;

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("José"))
                .andExpect(jsonPath("$.email").value("jose@finora.com"))
                .andExpect(jsonPath("$.senha").doesNotExist())
                .andExpect(jsonPath("$.senhaHash").doesNotExist());
    }

    @Test
    @DisplayName("Deve responder 400 com os campos inválidos e não chamar o service")
    void cadastrarResponde400() throws Exception {
        String corpo = """
                {"nome": "", "email": "isso-nao-e-email", "senha": "123"}
                """;

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome").exists())
                .andExpect(jsonPath("$.campos.email").exists())
                .andExpect(jsonPath("$.campos.senha").exists());

        verify(usuarioService, never()).cadastrar(any(), any(), any());
    }

    @Test
    @DisplayName("Deve responder 409 para e-mail já cadastrado")
    void cadastrarResponde409() throws Exception {
        when(usuarioService.cadastrar(any(), any(), any())).thenThrow(new EmailJaCadastradoException());

        String corpo = """
                {"nome": "José", "email": "jose@finora.com", "senha": "SenhaForte123"}
                """;

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.detail").value("Este e-mail já está cadastrado."));
    }
}