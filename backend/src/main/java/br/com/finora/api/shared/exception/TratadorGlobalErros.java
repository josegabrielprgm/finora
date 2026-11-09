package br.com.finora.api.shared.exception;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class TratadorGlobalErros extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NegocioException.class)
    public ProblemDetail tratarNegocio(NegocioException excecao) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(excecao.getStatus(), excecao.getMessage());
        return problema;
    }
}
