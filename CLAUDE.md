# Finora

Controle financeiro pessoal com autenticação segura. Projeto pessoal de aprendizado e portfólio.

## Stack
- **Back-end:** Spring Boot + Spring Security (JWT com refresh token), Maven, Java 21
- **Banco:** PostgreSQL + Flyway (migrations)
- **Front-end:** Angular + Angular Material 3 (SCSS, sem SSR)
  - PrimeNG foi removido: a partir da v22 ele exige chave de licença. Não reintroduzir.

## Estrutura
```
finora/
├── backend/    # API REST (Spring Boot), ainda não criada
└── frontend/   # Aplicação Angular
```

Front-end (`frontend/src/app/`):
```
core/        # guards, interceptors, models, AuthService (instância única)
shared/      # componentes e modelos reutilizáveis
features/
  auth/        # login, cadastro e validators
  dashboard/   # saldo do mês e totais por categoria
  transacoes/  # receitas e despesas
  categorias/
```
Cada feature tem `pages/` (telas ligadas a rotas). Rotas sempre com `loadComponent` (lazy loading).

## Funcionalidades
- **v1:** cadastro e login, receitas e despesas, categorias, saldo do mês e total por categoria, cada usuário vê só os próprios dados
- **v2:** metas de economia, gráficos, despesas fixas recorrentes

## Segurança (prioridade do projeto)
BCrypt para senhas, JWT com access token curto + refresh token com rotação, perfis USER/ADMIN, proteção contra IDOR, rate limiting no login, Bean Validation, CORS restrito, segredos só em variáveis de ambiente (nunca commitar `.env` ou `application-local.yml`).

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
  - `feature/*` funcionalidade nova, `fix/*` correção, `refactor/*` mudança técnica, `docs/*` documentação
- Decisões grandes (trocar biblioteca, mudar arquitetura) ganham branch e PR próprios, nunca vão "de carona" em outra tarefa
- Merge com **Squash and merge**, editando o título para o padrão Conventional Commits
- Commits em **Conventional Commits**, em português: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Depois de merge na `main`, sincronizar: `git checkout develop && git pull origin main`

## Convenções de código
- Nomes de métodos **sem preposição**: `selecionarArquivo`, não `aoSelecionarArquivo`
- Arquivos em minúsculas com ponto ou hífen (`finora.preset.ts`, `senhas-iguais.validator.ts`)
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
- [x] Front-end criado com Angular Material e tema "Escuro elegante"
- [x] Login e cadastro com auth mock, guard no dashboard
- [ ] Próximo: layout base (menu lateral) e dashboard com dados mock