package br.com.finora.api.config.jwt;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Configuration
public class JwtConfig {

    private final SecretKey chave;

    public JwtConfig(JwtProperties propriedades) {
        byte[] bytes = Base64.getDecoder().decode(propriedades.segredo());

        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET precisa ter pelo menos 32 bytes.");
        }
        this.chave = new SecretKeySpec(bytes, "HmacSHA256");
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JwtEncoder encoder = new NimbusJwtEncoder(new ImmutableSecret<>(chave));
        return encoder;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        JwtDecoder decoder = NimbusJwtDecoder.withSecretKey(chave).macAlgorithm(MacAlgorithm.HS256).build();
        return decoder;
    }

}
