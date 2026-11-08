# Finora

Controle financeiro pessoal com autenticação segura. Projeto pessoal de aprendizado e portfólio.

## Stack
- **Back-end:** Spring Boot + Spring Security (JWT com refresh token), Maven, Java 21
- **Banco:** PostgreSQL + Flyway (migrations)
- **Front-end:** Angular + PrimeNG (SCSS, sem SSR)

## Estrutura
```
finora/
├── backend/    # API REST (Spring Boot), ainda não criada
└── frontend/   # Aplicação Angular
```

Front-end (`frontend/src/app/`):
```
core/        # guards, interceptors, AuthService (instância única)
shared/      # componentes e modelos reutilizáveis
features/
  auth/        # login e cadastro
  dashboard/   # saldo do mês e totais por categoria
  transacoes/  # receitas e despesas
  categorias/
```

## Funcionalidades
- **v1:** cadastro e login, receitas e despesas, categorias, saldo do mês e total por categoria, cada usuário vê só os próprios dados
- **v2:** metas de economia, gráficos, despesas fixas recorrentes

## Segurança (prioridade do projeto)
BCrypt para senhas, JWT com access token curto + refresh token com rotação, perfis USER/ADMIN, proteção contra IDOR, rate limiting no login, Bean Validation, CORS restrito, segredos só em variáveis de ambiente (nunca commitar `.env` ou `application-local.yml`).

## Fluxo Git
- `main`: estável e protegida (só recebe merge via Pull Request vindo da `develop`)
- `develop`: integração
- `feature/*`: uma branch por tarefa, saindo da `develop`, PR de volta para a `develop`
- Commits em **Conventional Commits**, em português: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Depois de merge na `main`, sincronizar: `git checkout develop && git pull origin main`

## Convenções de código
- Nomes de métodos **sem preposição**: `selecionarArquivo`, não `aoSelecionarArquivo`
- Enquanto a API não existe, o front usa services com dados mock; depois troca por `HttpClient` sem mexer nas telas

## Ambiente
- Windows, PowerShell, projeto em `D:\Projetos\finora`
- Criar arquivos pelo VS Code (o Bloco de Notas adiciona `.txt` escondido)

## Como me ajudar
- Explicações curtas e diretas
- Explicar o porquê das decisões, não só o código
- Me cobrar boas práticas, como um tech lead faria
- Eu quero aprender: deixe eu rodar os comandos de Git (commit, push, PR) e explique cada um

## Status atual
- [x] Repositório organizado (README, .gitignore, main/develop, main protegida)
- [ ] Front-end: criando projeto Angular na branch `feature/configuracao-frontend`
- [ ] Próximo: tela de login (com mock)
