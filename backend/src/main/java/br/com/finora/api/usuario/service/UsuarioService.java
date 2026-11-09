package br.com.finora.api.usuario.service;

import br.com.finora.api.usuario.entity.Usuario;
import br.com.finora.api.usuario.exception.EmailJaCadastradoException;
import br.com.finora.api.usuario.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        String emailNormalizado = email.trim().toLowerCase(Locale.ROOT);
        if (repository.existsByEmail(emailf)){
            throw new EmailJaCadastradoException();
        }
        String senhaHash = passwordEncoder.encode(senha);
        Usuario usuarioSalvo  = repository.save(new Usuario(nome.trim(), emailf, senhahash));
        return usuarioSalvo;
    }
}
