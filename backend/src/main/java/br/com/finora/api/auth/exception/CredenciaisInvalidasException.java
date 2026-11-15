package br.com.finora.api.auth.exception;


import br.com.finora.api.shared.exception.NegocioException;
import org.springframework.http.HttpStatus;

public class CredenciaisInvalidasException extends NegocioException {

    public CredenciaisInvalidasException() {
        super(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.");
    }
}
