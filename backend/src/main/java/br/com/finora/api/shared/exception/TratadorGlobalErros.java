package br.com.finora.api.shared.exception;

import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class TratadorGlobalErros extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NegocioException.class)
    public ProblemDetail tratarNegocio(NegocioException excecao) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(excecao.getStatus(), excecao.getMessage());
        return problema;
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException excecao,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {

        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Um ou mais campos estão inválidos.");

        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : excecao.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }

        problema.setProperty("campos", campos);

        return ResponseEntity.badRequest().body(problema);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException excecao,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {

        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Corpo da requisição inválido.");

        return ResponseEntity.badRequest().body(problema);
    }

}
