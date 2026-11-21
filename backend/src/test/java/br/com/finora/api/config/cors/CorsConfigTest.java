package br.com.finora.api.config.cors;

import br.com.finora.api.config.security.SecurityConfig;
import br.com.finora.api.usuario.controller.UsuarioController;
import br.com.finora.api.usuario.mapper.UsuarioMapperImpl;
import br.com.finora.api.usuario.service.UsuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UsuarioController.class,
        properties = "finora.cors.origens-permitidas=http://localhost:4200")
@Import({SecurityConfig.class, CorsConfig.class, UsuarioMapperImpl.class})
class CorsConfigTest {

    private static final String ROTA = "/api/usuarios/eu";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    @DisplayName("Deve devolver Access-Control-Allow-Origin para origem permitida")
    void origemPermitidaRecebeCabecalho() throws Exception {
        mockMvc.perform(options(ROTA)
                        .header(HttpHeaders.ORIGIN, "http://localhost:4200")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(
                        HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:4200"));
    }

    @Test
    @DisplayName("Não deve devolver Access-Control-Allow-Origin para origem desconhecida")
    void origemDesconhecidaNaoRecebeCabecalho() throws Exception {
        mockMvc.perform(options(ROTA)
                        .header(HttpHeaders.ORIGIN, "http://site-malicioso.com")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }
}