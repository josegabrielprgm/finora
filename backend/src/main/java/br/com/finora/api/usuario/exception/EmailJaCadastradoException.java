package br.com.finora.api.usuario.exception;

public class EmailJaCadastradoException extends RuntimeException{

    public EmailJaCadastradoException() {
        super("Este e-mail já está cadastrado.");

    }
}
