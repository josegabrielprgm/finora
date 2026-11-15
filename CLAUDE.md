# Finora

Controle financeiro pessoal com autenticação segura. Projeto pessoal de aprendizado e portfólio.

## Stack
- **Back-end:** Spring Boot 4 + Spring Security (JWT com refresh token, em construção), Maven, Java 21
- **Banco:** PostgreSQL 17 (via Docker Compose) + Flyway (migrations)
- **Front-end:** Angular 22 + Angular Material 3 (SCSS, sem SSR), deploy no Vercel
  - PrimeNG foi removido: a partir da v22 ele exige chave de licença. Não reintroduzir.

## Estrutura
```
finora/
├── backend/    # API REST (Spring Boot)
└── frontend/   # Aplicação Angular
```

Front-end (`frontend/src/app/`):
```
core/
  guards/        # authGuard
  interceptors/  # (vazio por enquanto)
  layout/shell/  # moldura com menu lateral / barra inferior
  models/
  services/      # AuthService e TransacaoService (instância única, dados mock)
shared/          # utils, componentes e modelos reutilizáveis
features/
  auth/          # login, cadastro e validators
  dashboard/     # saldo do mês e totais por categoria (components/ + cálculos)
  transacoes/    # receitas e despesas
  categorias/
```
Cada feature tem `pages/` (telas ligadas a rotas) e, se precisar, `components/` (partes da tela). Rotas sempre com `loadComponent` (lazy loading); as privadas ficam como filhas do `Shell`, protegidas pelo `authGuard` na rota pai.

## Back-end
- Pacote base: `br.com.finora.api`
- Organização **por funcionalidade** (`auth/`, `usuario/`...), cada uma com as subpastas que precisar:
  `controller/`, `service/`, `repository/`, `entity/`, `dto/request/`, `dto/response/`, `exception/`
- `shared/`: código usado por várias funcionalidades (ex.: `shared/exception/`); `config/`: configurações (ex.: `SecurityConfig`)
- Banco: PostgreSQL sobe sozinho pelo `spring-boot-docker-compose` (`backend/compose.yaml`). Credenciais no `backend/.env` (copiado do `.env.example`, nunca commitado). Os testes também sobem o compose: Docker Desktop precisa estar aberto
- Migrations Flyway em `src/main/resources/db/migration` (`V1__cria_tabela_usuarios.sql`...). Hibernate com `ddl-auto: validate`: o schema só muda por migration
- Testes manuais da API em `backend/http/auth.http` (HTTP Client do IntelliJ)
- Endpoints atuais: `POST /api/auth/cadastro` (público); todo o resto exige autenticação

### Padrões de código do back-end
- Exceções de negócio herdam de `NegocioException`, passando o status HTTP no construtor (ex.: `EmailJaCadastradoException` → 409)
- Erros sempre no formato **ProblemDetail**, centralizados no `TratadorGlobalErros` (`@RestControllerAdvice`). Erros de validação trazem a propriedade `campos`; erros inesperados viram 500 genérico, sem vazar detalhes
- DTOs como `record`, com Bean Validation no request; o response nunca expõe senha/hash
- Injeção de dependência pelo construtor, com campos `final` (sem `@Autowired` em campo)
- Guardar o resultado numa variável antes de retornar (`UsuarioResponse resposta = ...; return resposta;`), para facilitar debug
- Testes com `@DisplayName` descrevendo a regra ("Deve salvar a senha com hash") e nome do método sem preposição (`cadastrarSalvaHash`, `cadastrarResponde409`)
  - Service: teste unitário com Mockito; controller: `@WebMvcTest` + `@Import(SecurityConfig.class)`

## Funcionalidades
- **v1:** cadastro e login, receitas e despesas, categorias, saldo do mês e total por categoria, cada usuário vê só os próprios dados
- **v2:** metas de economia, gráficos, despesas fixas recorrentes

## Segurança (prioridade do projeto)
BCrypt para senhas, JWT com access token curto + refresh token com rotação, perfis USER/ADMIN, proteção contra IDOR, rate limiting no login, Bean Validation, CORS restrito, segredos só em variáveis de ambiente (nunca commitar `.env` ou `application-local.yml`).

No back:
- E-mail normalizado (trim + minúsculas) antes de salvar e de checar duplicidade
- API stateless (sem sessão), CSRF/form login/HTTP Basic desligados

No front:
- Access token só em memória (signal), **nunca** em localStorage (XSS)
- Mensagens de erro de login genéricas (não revelar se o e-mail existe)
- Perfil do usuário sempre vem do servidor, nunca do formulário

## Padrão visual: "Escuro elegante"
- Tema Material 3 em `src/styles.scss` (`mat.theme` + `mat.theme-overrides`): fundo azul-marinho, ações em âmbar
- Todas as cores vêm de `--mat-sys-*` (tokens do Material) ou `--finora-*` (variáveis do `styles.scss`). **Nunca** usar hex solto nos componentes
- Verde é sempre receita (`.valor-receita`) e vermelho é sempre despesa (`.valor-despesa`), em todas as telas
- Valores monetários com a classe `.valor` (`tabular-nums`) e o pipe `currency:'BRL'`
- Fonte Inter; ícones com `<mat-icon>` (Material Symbols Outlined)
- Layout: menu lateral (Dashboard, Transações, Categorias) + conteúdo; no celular, menu inferior
- Componentes: `mat-card` para resumos, `mat-table` para listas, `MatDialog` para criar/editar transação, `MatSnackBar` para confirmações
- Só um botão de destaque (`matButton="filled"`, âmbar) por tela; o resto `outlined` ou `text`

## Fluxo Git
- `main`: estável e protegida (só recebe merge via Pull Request vindo da `develop`)
- `develop`: branch padrão do GitHub e de integração
- Uma branch por tarefa, saindo da `develop`, PR de volta para a `develop`:
  - `feature/*` funcionalidade nova, `fix/*` correção, `refactor/*` mudança técnica, `docs/*` documentação, `test/*` testes, `chore/*` manutenção/infra
- Decisões grandes (trocar biblioteca, mudar arquitetura) ganham branch e PR próprios, nunca vão "de carona" em outra tarefa
- Merge com **Squash and merge**, editando o título para o padrão Conventional Commits
- Commits em **Conventional Commits**, em português: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Depois de merge na `main`, sincronizar (PowerShell 5.1 não tem `&&`): `git checkout develop; git pull origin main`

## Convenções de código
- Nomes de métodos **sem preposição**: `selecionarArquivo`, não `aoSelecionarArquivo`
- Arquivos do front em minúsculas com ponto ou hífen (`auth.guard.ts`, `senhas-iguais.validator.ts`); no back, classes Java em PascalCase
- Enquanto o front não chama a API, ele usa services com dados mock; depois troca por `HttpClient` sem mexer nas telas

## Ambiente
- Windows, PowerShell, projeto em `D:\Projetos\finora`
- Criar arquivos pelo VS Code (o Bloco de Notas adiciona `.txt` escondido)
- Rodar: `backend/` → `.\mvnw spring-boot:run` (Docker Desktop aberto); `frontend/` → `ng serve`
- Testar: `.\mvnw test` no back, `ng test` no front
- Demo (só front, dados mock): https://finora-opal.vercel.app, usuário `demo@finora.com` / `Senha@123`

## Como me ajudar
- Explicações curtas e diretas
- Explicar o porquê das decisões, não só o código
- Me cobrar boas práticas, como um tech lead faria
- Eu quero aprender: deixe eu rodar os comandos de Git (commit, push, PR) e explique cada um

## Status atual
- [x] Repositório organizado (README, .gitignore, main/develop, main protegida)
- [x] Front-end criado com Angular Material e tema "Escuro elegante"
- [x] Login e cadastro com auth mock, guard nas rotas privadas
- [x] Layout base (menu lateral + barra inferior no celular)
- [x] Dashboard com dados mock
- [x] Deploy do front-end no Vercel
- [x] Back-end: cadastro de usuário com senha em BCrypt
- [x] Back-end: tratamento global de erros com ProblemDetail
- [x] Back-end: testes do cadastro (service e controller)
- [ ] Próximo: login com JWT (access token + refresh token)
