CREATE TABLE usuarios (
                          id          UUID PRIMARY KEY,
                          nome        VARCHAR(100) NOT NULL,
                          email       VARCHAR(255) NOT NULL UNIQUE,
                          senha_hash  VARCHAR(100) NOT NULL,
                          perfil      VARCHAR(20)  NOT NULL,
                          criado_em   TIMESTAMPTZ  NOT NULL DEFAULT now(),

                          CONSTRAINT ck_usuarios_perfil CHECK (perfil IN ('USER', 'ADMIN')),
                          CONSTRAINT ck_usuarios_email_minusculo CHECK (email = lower(email))
);