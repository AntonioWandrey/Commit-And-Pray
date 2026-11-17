# Estrutura do repositório Commit-And-Pray — proposta para o time

Nov 17, 2026 · @Pietro

## 1. Decisão

Mantemos um único repositório (monorepo) com o backend organizado em módulos de negócio. A refatoração já foi feita: o código antigo, dividido por camadas técnicas, saiu, e os módulos novos entram sobre uma base limpa.

|  | Decisão |
| --- | --- |
| **Mantemos** | Repositório único com `backend/`, `docs/`, `tools/` e, em seguida, `mobile/`; migrações Flyway com `ddl-auto: validate`; `AGENTS.md` e `.gitignore` atuais |
| **Já feito** | Pacote `br.com.unifebe.saude.api`, PostgreSQL 17 no lugar do MySQL, pipeline no GitHub Actions, `.env.example`, verificação de fronteiras com Spring Modulith e a especificação em `docs/especificacoes/` |
| **Fazemos agora** | Módulos `contas`, `diario` e `canais`, que o piloto de 20/11 exige, e depois `ciclo` |
| **Adiamos** | Painel de curadoria (`admin-web/`) e os módulos `personalizacao`, `gestacao`, `metodos`, `lembretes`, `conteudo` e `questionarios` |

O piloto de 20/11 depende só do fluxo bot → diário → histórico. Por isso `contas`, `diario` e `canais` vêm antes de `ciclo`, mesmo com os quatro na fase Agora.

## 2. Estado atual do repositório

Em 17/11/2026, a `dev` (commit `38bc6d0`) e a `main` têm o mesmo código. O backend tem a base da aplicação, mas nenhum módulo de negócio. Lemos o código, mas não compilamos nem rodamos a API.

| # | Item | Situação | Onde |
| --- | --- | --- | --- |
| 1 | Base da API | Java 21, Spring Boot 4.1.2, Spring Modulith 2.1.1 e PostgreSQL 17 pelo Docker Compose. Só existem a classe de inicialização e o pacote `shared`, ainda vazio | `backend/cuidado-feminino-api` |
| 2 | Migrações | V1 (tabela de eventos do Spring Modulith) e V2 (`ubs`, `perfil`, `usuario`, `usuario_perfil`). Faltam `condicao` e `usuario_condicao`, usadas pelas rotas de condições | `src/main/resources/db/migration` |
| 3 | Código antigo | O ciclo (com o `MotorPreditivoCiclo`) e o registro legado foram removidos na refatoração, não movidos. Continuam no histórico do Git, no commit `5ef6d06` | Histórico do Git |
| 4 | Segurança | Spring Security e OAuth2 Resource Server estão no `pom.xml` sem configuração, então vale a proteção padrão, com a senha gerada no log | `pom.xml` |
| 5 | Testes | Teste de contexto com Testcontainers e `ModularidadeTest`. Sem módulos, o teste de fronteiras ainda não verifica nada. O teste usa `postgres:latest`, e o banco local, `postgres:17` | `src/test` |
| 6 | Pipeline | GitHub Actions roda `mvnw verify` com JDK 21 em pull requests e pushes para `main` e `dev` | `.github/workflows/backend-ci.yml` |
| 7 | Bot | Simulador local com núcleo conversacional separado da interface (M1 aprovada; M2 mesclada pela PR #12). Ainda não chama a API | `tools/simulador-bot/` |
| 8 | App e painel | `mobile/` e `admin-web/` ainda não existem | Raiz |
| 9 | Metadados | `name`, `description`, `url`, `licenses`, `developers` e `scm` vazios | `pom.xml` |

Pontos fortes que não mudam: migrações Flyway com `ddl-auto: validate`, `.gitignore` que protege `.env` e credenciais, orientações de privacidade no `AGENTS.md` e o contrato da API já detalhado para a fase Agora.

## 3. Estrutura proposta

A raiz continua simples: uma pasta por aplicação, mais `docs/` e `.github/`. Dentro do backend, cada módulo de negócio da especificação vira um pacote com a mesma forma. A pasta `backend/cuidado-feminino-api` mantém o nome atual para não quebrar os caminhos do `README.md` e do `AGENTS.md`.

```text
Commit-And-Pray/
├─ backend/cuidado-feminino-api/
│  ├─ docker-compose.yaml      # PostgreSQL local
│  ├─ .env.example             # variáveis do banco, sem segredos
│  ├─ pom.xml
│  └─ src/
│     ├─ main/java/br/com/unifebe/saude/api/
│     │  ├─ CuidadoFemininoApiApplication.java
│     │  ├─ contas/          # conta, login, perfis, vínculo com canal e remetente
│     │  ├─ ciclo/           # calendário, previsão, janela fértil
│     │  ├─ diario/          # humor e queixa por conversa, histórico por conta
│     │  ├─ canais/          # rota do bot, simulador e (depois) WhatsApp
│     │  ├─ personalizacao/  # (depois) painéis e conteúdos por perfil
│     │  ├─ gestacao/        # (depois) idade gestacional, DPP, movimentos fetais, mamadas
│     │  ├─ metodos/         # (depois) método contraceptivo e medicamentos
│     │  ├─ lembretes/       # (depois) agenda, lembretes automáticos e notificações
│     │  ├─ conteudo/        # (depois) conteúdos, guia de sintomas, perguntas anônimas, UBSs
│     │  ├─ questionarios/   # (depois) quiz, checklists e escalas
│     │  └─ shared/          # corpo de erro, segurança, paginação (módulo aberto)
│     ├─ main/resources/
│     │  ├─ application.yaml  application-dev.yml
│     │  └─ db/migration/  # V1 (Spring Modulith), V2 (contas); novas em sequência
│     └─ test/java/br/com/unifebe/saude/api/   # inclui ModularidadeTest
├─ mobile/                  # Expo + React Native + TypeScript
├─ admin-web/               # painel de curadoria (fase posterior)
├─ tools/simulador-bot/     # simulador local de conversa para a demonstração
├─ docs/
│  ├─ especificacoes/       # requisitos, regras, casos de uso, MER, diagramas e API
│  ├─ decisoes/             # registros de decisão de arquitetura (ADRs)
│  └─ transplante-e-chatbot.md
├─ .github/workflows/       # pipeline do backend e verificação de fronteiras
├─ AGENTS.md  CLAUDE.md  CODEX.md
└─ README.md
```

O backend tem dez módulos: os oito da especificação mais `diario` e `canais`, que vieram do guia do chatbot. A coluna Fase é uma proposta para o time confirmar.

| Módulo | Responsabilidade | Rotas (sob `/api/v1`) | Fase |
| --- | --- | --- | --- |
| `contas` | Cadastro, autenticação, modo confidencial, perfis ativos e vínculo com o canal | `/auth`, `/contas`, `/condicoes`, `/admin/auth` | Agora |
| `ciclo` | Calendário, previsão do ciclo, janela fértil e alerta de irregularidade | `/ciclo` | Agora |
| `diario` | Humor e queixa, com gravação idempotente por canal, remetente e mensagem, e histórico por conta | `/diario` | Agora |
| `canais` | Rota do bot, simulador de conversa e, depois, adaptador do WhatsApp | `/bot` | Agora |
| `personalizacao` | Decide quais painéis e conteúdos cada pessoa vê conforme os perfis ativos | `/perfis`, `/painel` | Depois |
| `gestacao` | Idade gestacional, DPP, movimentos fetais, mamadas e humor no puerpério | `/gestacao` | Depois |
| `metodos` | Método contraceptivo em uso e controle de medicamentos | `/metodos`, `/medicamentos` | Depois |
| `lembretes` | Agenda, lembretes automáticos e disparo de notificações | `/lembretes`, `/notificacoes` | Depois |
| `conteudo` | Conteúdos, guia de sintomas, chat automático, perguntas anônimas e UBSs | `/conteudos`, `/guia-sintomas`, `/chat`, `/perguntas-anonimas`, `/ubs`, `/admin` | Depois |
| `questionarios` | Quiz de métodos, checklists e escalas de avaliação | `/questionarios` | Depois |

Cada módulo tem a mesma forma interna:

```text
ciclo/
├─ CicloModuloApi.java   # única porta de entrada para outros módulos
├─ web/                  # controller e DTOs HTTP
├─ application/          # serviços e exceções do caso de uso
└─ domain/               # entidades, regras e repositórios
```

### Onde fica cada peça da API

As rotas ficam no `web/` do módulo dono do prefixo, e o que vale para a API toda fica em `shared`. O contrato completo (76 rotas, JSON e erros) está na aba API de Minha Saúde Feminina — Especificação de Requisitos e Modelagem.

| Peça | Onde fica | Observação |
| --- | --- | --- |
| Controller e DTOs de requisição e resposta | `<módulo>/web/` | Um controller por prefixo de rota. Devolve DTO, nunca entidade |
| Regra do caso de uso | `<módulo>/application/` | Recebe o id da conta já resolvido pelo servidor |
| Entidade e repositório | `<módulo>/domain/` | Só o próprio módulo lê e grava |
| Corpo de erro (`codigo`, `mensagem`) e tradução das exceções | `shared/web/` | Um único `@RestControllerAdvice` para todos os módulos |
| Envelope de paginação | `shared/web/` | `itens`, `pagina`, `tamanho`, `total` |
| Regras de acesso por prefixo e leitura do JWT | `shared/seguranca/` | Entrega aos controllers o id da conta autenticada |
| Emissão do JWT no login | `contas/application/` | Só `contas` cria token de conta |
| Conferência do token do canal | `canais/web/` | Vale só para `/bot/**`. O token do simulador só existe nos perfis `dev` e `piloto` |
| Contas e vínculos fictícios do piloto | Carga própria do perfil `piloto` | Fora das migrações numeradas (forma a decidir) |

Na fase Agora, três chamadas cruzam a fronteira entre módulos. Os nomes dos métodos são proposta:

| Chamada | De | Para | Como |
| --- | --- | --- | --- |
| Encontrar a conta de um remetente | `canais` | `contas` | `ContasModuloApi.encontrarContaPorRemetente(canal, remetenteRef)` |
| Confirmar um código de vínculo | `canais` | `contas` | `ContasModuloApi.confirmarVinculo(canal, remetenteRef, codigo)` |
| Gravar humor ou queixa sem duplicar | `canais` | `diario` | `DiarioModuloApi.registrarEntrada(...)` |

A exclusão de conta usa um evento interno (`ContaExcluida`), e cada módulo apaga os próprios dados.

Caminho de uma mensagem do bot:

1. `canais/web` recebe `POST /api/v1/bot/eventos` e confere o token do canal.
2. `canais` pede a conta do remetente a `ContasModuloApi`. Sem vínculo, responde `403` e para.
3. `canais` entrega a entrada a `DiarioModuloApi`, que grava ou reconhece o reenvio.
4. `canais` responde `201` (entrada nova) ou `200` (reenvio).

### Código antigo

A refatoração (PR #2) removeu o código antigo em vez de movê-lo para os módulos. Para recriar o módulo `ciclo`, use como referência o commit `5ef6d06`: `MotorPreditivoCiclo`, `CicloService`, as entidades e os DTOs de ciclo. Adapte ao contrato da API e à forma interna acima; não copie o pacote antigo.

O fluxo legado de registro não volta: ele gravava sem conta e consultava tudo de forma global. A jornada nova do diário usa contrato próprio e histórico por conta, como o `AGENTS.md` já orienta.

## 4. Regras do monólito modular

Um único deploy, com fronteiras claras entre módulos. Cinco regras bastam para o time, e todas podem ser verificadas pela pipeline.

| # | Regra | Como verificar |
| --- | --- | --- |
| 1 | Um módulo só usa outro pela classe `...ModuloApi` da raiz do pacote; `web/`, `application/` e `domain/` são internos | Teste de arquitetura que reprova importação de pacote interno de outro módulo |
| 2 | Cada módulo é dono das suas tabelas; nenhum outro módulo as lê ou escreve, e não há `JOIN` entre tabelas de módulos diferentes | Revisão do PR; migrações com prefixo da tabela por módulo |
| 3 | Controllers devolvem DTOs, nunca entidades JPA | Teste de arquitetura sobre `web/` |
| 4 | Toda consulta de dado pessoal filtra pela conta identificada no servidor, não por parâmetro enviado pelo cliente | Teste de integração com duas contas fictícias (o cenário 4 do guia do chatbot) |
| 5 | Efeito entre módulos usa evento interno, por exemplo o parto registrado encerra a gestação e ativa o puerpério | Revisão do PR |

A regra 1 é verificada pelo Spring Modulith 2.1.1, no teste `ModularidadeTest`, que roda na pipeline com o Spring Boot 4.1.2. Os módulos que ainda não existem (`personalizacao`, `gestacao`, `metodos`, `lembretes`, `conteudo`, `questionarios`) entram depois, com a mesma forma dos primeiros.

## 5. Convenções de trabalho

As convenções de branch, commit e pull request seguem o `README.md`. As demais são propostas para o time aprovar ou ajustar.

| Tema | Convenção |
| --- | --- |
| Branch principal | `main` protegida: entra só por pull request vindo da `dev`, com pelo menos 1 aprovação e a pipeline verde |
| Branches de trabalho | Criadas a partir da `dev`: `feat/...`, `fix/...`, `refactor/...`, `docs/...`, em inglês e minúsculas (por exemplo, `feat/local-database-setup`); vida curta, um assunto por branch |
| Commits | Conventional Commits em inglês, sem escopo e em uma linha, por exemplo `feat: add local PostgreSQL setup with Docker Compose` |
| Merge | Branch de trabalho para `dev`: *Squash and merge*. `dev` para `main`: *Create a merge commit*, para as duas branches não divergirem. Nada de commit direto na `main` |
| Pull requests | Pequenos, descrevendo o que foi feito, por quê, mudanças e impacto; refatoração e mudança de comportamento ficam em PRs separados |
| Nomes | Pacotes Java em minúsculas; código e tabelas em português, sem acento e sem marca de gênero (`usuario`, ADR 01); um sufixo por papel (`Controller`, `Service`, `Request`, `Response`) |
| Banco | Toda mudança de schema é migração nova, numerada em sequência: V1 Spring Modulith, V2 contas, V3 vínculo de canal, V4 diário. Reserve o número com o time antes de começar, para duas PRs não usarem o mesmo. Nunca edite uma migração que já entrou na `main` |
| Segredos | Nada de senha ou chave no Git; variáveis de ambiente locais e `.env.example` com nomes sem valores; segredos do GitHub Actions na pipeline |
| Dados de teste | Só dados fictícios, como já pede o `AGENTS.md`; relatos e mensagens de usuárias não vão para logs |
| Pipeline | Um workflow por pasta (backend, mobile). O do backend dispara em todo pull request e push para `main` e `dev` e roda `mvnw verify` com JDK 21 e os testes de arquitetura. O `mvnw` precisa manter o modo executável (`100755`) no Git |
| Decisões | Cada decisão de arquitetura vira um arquivo curto e numerado em `docs/decisoes/` (contexto, decisão, consequência) |

## 6. Plano de migração

São sete pull requests em ordem. Os três primeiros já foram feitos, em parte; do 4 ao 6 é o caminho do piloto de 20/11, e o 7 vem depois. Os responsáveis ficam em branco para o time distribuir.

| # | Pull request | Situação | Pronto quando | Responsável |
| --- | --- | --- | --- | --- |
| 1 | Reorganização em módulos e pacote `br.com.unifebe.saude.api` | Feito (PR #2). O código antigo foi removido em vez de movido | `mvnw verify` passa na base nova |  |
| 2 | Pipeline do GitHub Actions, `.env.example`, `main` protegida e metadados do `pom.xml` | Pipeline e `.env.example` feitos. Faltam os metadados do `pom.xml` e conferir a proteção da `main` | Um PR de teste é barrado quando o build quebra |  |
| 3 | Testes de arquitetura (regras 1 e 3 da seção 4) | Regra 1 feita com o `ModularidadeTest` (PR #11). Falta a regra 3 | Importar pacote interno de outro módulo ou devolver entidade em `web/` reprova o PR |  |
| 4 | `shared/web`, `shared/seguranca` e módulo `contas`: entidades da V2, login com JWT, `GET /contas/me` e migração V3 (vínculo com canal) | A fazer. Só a V2 existe | A Conta A e a Conta B fazem login e cada uma vê só os próprios dados |  |
| 5 | Módulos `diario` e `canais` com a migração V4: `POST /bot/eventos`, `GET /diario/historico` e carga de dados fictícios do perfil `piloto` | A fazer | Os 8 passos do cenário de aceite do contrato da API passam em teste de integração |  |
| 6 | Simulador ligado à API (missão M3), tela de Histórico em `mobile/` e roteiro da demonstração (M4) | A fazer. O simulador existe, mas não chama a API | O cenário completo da demonstração roda com dados fictícios |  |
| 7 | Módulo `ciclo` (11 rotas), usando o commit `5ef6d06` como referência | Depois do piloto | As rotas de `/ciclo` respondem como no contrato da API |  |

A especificação já está em `docs/especificacoes/`. Falta levar para lá o contrato da API (aba API da especificação) e registrar este documento como decisão em `docs/decisoes/`.

## 7. Decisões

Já decididas:

- Pacote base `br.com.unifebe.saude.api`.
- A pasta `backend/cuidado-feminino-api` mantém o nome, o que preserva os caminhos do `README.md` e do `AGENTS.md`.
- Fronteiras verificadas pelo Spring Modulith 2.1.1, compatível com o Spring Boot 4.1.2.
- Banco PostgreSQL 17 no lugar do MySQL.
- Commits em inglês, sem escopo, como no `README.md`.
- WPPConnect Server para a futura integração com o WhatsApp (missão M5, fora do piloto).

Em aberto:

- [ ] O adaptador do WhatsApp fica no módulo `canais` do backend (proposto) ou como serviço à parte.
- [ ] O painel de curadoria (`admin-web/`) entra neste semestre ou fica fora da demonstração; a especificação o prevê e o repositório ainda não.
- [ ] Quantas aprovações um PR exige na `main` (1 proposta) e quem pode aprovar.
- [ ] Quem assume cada pull request da seção 6.
- [ ] Qual módulo é dono das tabelas `perfil` e `ubs`, que a V2 criou junto com as de contas.
