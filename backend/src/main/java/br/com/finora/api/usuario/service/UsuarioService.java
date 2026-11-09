package br.com.finora.api.usuario.service;

import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.exception.EmailJaCadastradoException;
import br.com.finora.api.usuario.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario cadastrar(String nome, String email, String senha){
        String emailf = email.trim().toLowerCase(Locale.ROOT);
        if (repository.existsByEmail(emailf)){
            throw new EmailJaCadastradoException();
        }
        String senhahash = passwordEncoder.encode(senha);
        Usuario saved = repository.save(new Usuario(nome.trim(), emailf, senhahash));
        return saved;
    }
}
