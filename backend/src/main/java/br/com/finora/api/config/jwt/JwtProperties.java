package br.com.finora.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "finora.jwt")
public record JwtProperties(String segredo, Duration expiracao) {
}
