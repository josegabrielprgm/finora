package br.com.finora.api.usuario.exception;

import br.com.finora.api.shared.exception.NegocioException;
import org.springframework.http.HttpStatus;

public class EmailJaCadastradoException extends NegocioException {

    public EmailJaCadastradoException() {
        super(HttpStatus.CONFLICT, "Este e-mail já está cadastrado.");

    }
}
