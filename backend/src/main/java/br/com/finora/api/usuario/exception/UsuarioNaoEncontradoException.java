package br.com.finora.api.usuario.exception;

import br.com.finora.api.shared.exception.NegocioException;
import org.springframework.http.HttpStatus;

public class UsuarioNaoEncontradoException extends NegocioException {

    public UsuarioNaoEncontradoException() {
        super(HttpStatus.NOT_FOUND, "Usuário não encontrado.");
    }
}