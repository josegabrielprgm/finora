package br.com.finora.api.auth.service;

import br.com.finora.api.auth.dto.response.TokenResponse;
import br.com.finora.api.config.jwt.JwtProperties;
import br.com.finora.api.usuario.entity.Usuario;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final JwtProperties propriedades;

    public TokenService(JwtEncoder jwtEncoder, JwtProperties propriedades) {
        this.jwtEncoder = jwtEncoder;
        this.propriedades = propriedades;
    }

    public TokenResponse gerar(Usuario usuario) {
        Instant agora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("finora-api")
                .issuedAt(agora)
                .expiresAt(agora.plus(propriedades.expiracao()))
                .subject(usuario.getId().toString())
                .claim("perfil", usuario.getPerfil().name())
                .build();


        JwsHeader cabecalho = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(cabecalho, claims)).getTokenValue();

        TokenResponse resposta = new TokenResponse(token, "Bearer", propriedades.expiracao().toSeconds());
        return resposta;
    }
}
