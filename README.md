<div align="center">

# 💰 Finora

**Controle financeiro pessoal com segurança levada a sério.**

Registre receitas e despesas, organize por categorias e acompanhe seu saldo, com seus dados protegidos por autenticação JWT, senhas com hash e acesso isolado por usuário.

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-6DB33F?logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?logo=springsecurity&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-Material-DD0031?logo=angular)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow)

</div>

---

## 📌 Sobre o projeto

Dados financeiros estão entre as informações mais sensíveis de uma pessoa. Por isso, o Finora foi pensado com **segurança desde a primeira linha de código** (*security by design*), e não como algo adicionado no final.

O projeto também segue práticas de times profissionais: fluxo de branches, commits padronizados, issues e Pull Requests para cada funcionalidade.

---

## ✨ Funcionalidades

### Versão 1
- [ ] Cadastro e login de usuários
- [ ] Registro de receitas e despesas
- [ ] Categorias personalizadas
- [ ] Saldo do mês e total por categoria
- [ ] Isolamento de dados: cada usuário acessa apenas os próprios registros

### Versão 2
- [ ] Metas de economia
- [ ] Gráficos de gastos
- [ ] Despesas fixas recorrentes

---

## 🔐 Segurança

| Prática | Por quê | Status |
|---|---|---|
| Senhas com hash **BCrypt** | Mesmo com vazamento do banco, as senhas não ficam expostas | ✅ |
| **JWT** com access token de curta duração | Reduz o estrago caso um token seja roubado | ⏳ |
| **Refresh token** com rotação | Mantém o usuário logado sem tokens de vida longa | ⏳ |
| Autorização por perfil (**USER / ADMIN**) | Cada um acessa só o que pode | ⏳ |
| Proteção contra **IDOR** | Um usuário não consegue ler dados de outro trocando o ID na URL | ⏳ |
| **Rate limiting** no login | Dificulta ataques de força bruta | ⏳ |
| Validação de entrada (**Bean Validation**) | Bloqueia dados inválidos ou maliciosos | ✅ |
| **CORS** restrito | Só o front-end autorizado chama a API | ⏳ |
| Segredos em **variáveis de ambiente** | Nenhuma senha ou chave vai para o repositório | ✅ |

---

## 🏗️ Arquitetura

```mermaid
flowchart LR
    U[Usuário] --> F[Angular + Material]
    F -- "HTTPS + JWT" --> B[API Spring Boot]
    B --> S[Spring Security]
    S --> D[(PostgreSQL)]
```

```
finora/
├── backend/    # API REST (Spring Boot)
└── frontend/   # Aplicação web (Angular)
```

---

## 🧠 Decisões técnicas

Registro das principais escolhas e o motivo de cada uma:

- **Spring Security em vez de autenticação manual:** é o padrão do mercado, testado em produção e mantido pela comunidade. Reinventar segurança é um risco.
- **JWT stateless:** a API não guarda sessão, o que facilita escalar.
- **Monorepo:** back e front no mesmo repositório deixam o histórico de cada funcionalidade completo num só lugar.

---

## 🌿 Fluxo de trabalho

- `main`: código estável
- `develop`: integração das funcionalidades
- `feature/*`: uma branch por funcionalidade, sempre saindo da `develop`

Commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
feat: adiciona cadastro de usuário
fix: corrige cálculo do saldo mensal
docs: atualiza README
```

---

## 🌐 Demo

**[finora-opal.vercel.app](https://finora-opal.vercel.app)**

| Usuário de teste | |
|---|---|
| E-mail | `demo@finora.com` |
| Senha | `Senha@123` |

> ⚠️ A demo publicada é só o front-end e ainda usa **dados simulados** (mock): o login e as transações não passam pela API. A integração com o back-end vem nas próximas versões.

---

## 🚀 Como executar

### Pré-requisitos
- [Java 21](https://adoptium.net/)
- [Node.js](https://nodejs.org/) (com npm)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) aberto

### Back-end

```powershell
cd backend
copy .env.example .env      # depois abra o .env e preencha DB_PASSWORD
.\mvnw spring-boot:run
```

O PostgreSQL sobe sozinho via Docker Compose (`compose.yaml`) e o Flyway cria as tabelas. A API fica em `http://localhost:8080`.

### Front-end

```powershell
cd frontend
npm install
ng serve
```

Acesse `http://localhost:4200`. Sem o Angular CLI instalado globalmente, use `npx ng serve`.

### Testes

```powershell
# back-end (precisa do Docker Desktop aberto)
cd backend
.\mvnw test

# front-end
cd frontend
ng test
```

---

## 👤 Autor

**José Gabriel**
[GitHub](https://github.com/josegabrielprgm)