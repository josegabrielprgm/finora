package br.com.finora.api.auth.dto.response;

public record TokenResponse(String accessToken,
                            String tipo,
                            long expiraEm
) {
}
