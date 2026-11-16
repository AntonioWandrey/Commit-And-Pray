# Minha Saúde Feminina

Aplicativo gratuito que informa, orienta e acompanha a saúde da mulher em cada fase da vida, sem substituir o atendimento na UBS. Projeto de Intervenção, 4ª fase, 2025.2 (UNIFEBE).

> **Status:** em desenvolvimento. O backend está sendo reestruturado como monólito modular; o app móvel e o painel de curadoria ainda não foram criados.

## Sumário

- [Visão geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Como rodar o backend](#como-rodar-o-backend)
- [Testes](#testes)
- [Banco de dados e migrações](#banco-de-dados-e-migrações)
- [Convenções do projeto](#convenções-do-projeto)
- [Fluxo de trabalho no Git](#fluxo-de-trabalho-no-git)
- [Documentação](#documentação)
- [Privacidade e LGPD](#privacidade-e-lgpd)

## Visão geral

O app atende a usuária em diferentes fases da vida e libera painéis e conteúdos conforme o perfil dela: adolescente, mulher adulta, idosa, gestante, puerpério, tentante, evitando gravidez, doença ginecológica prévia, vivendo com HIV e LGBTQIA+.

A especificação define:

| Item | Quantidade |
|---|---|
| Requisitos funcionais | 47 em 7 módulos |
| Requisitos não funcionais | 16 |
| Regras de negócio | 24 |
| Casos de uso | 22 |
| Entidades do modelo de dados | 25 |

Principais funcionalidades: cadastro inteligente com perfis, calendário menstrual com análise do ciclo e janela fértil, acompanhamento de gestação e puerpério, métodos contraceptivos e medicamentos, lembretes e notificações, conteúdo educativo curado pela equipe de saúde, perguntas anônimas e questionários.

## Arquitetura

**Monólito modular**: um único deploy da API, dividido em módulos por área de negócio. Os clientes (app móvel e painel de curadoria) ficam no mesmo repositório (monorepo) e consomem a API por HTTPS/JSON.

Módulos do backend:

| Módulo | Responsabilidade |
|---|---|
| `contas` | Cadastro, autenticação, modo confidencial e perfis ativos |
| `personalizacao` | Decide quais painéis e conteúdos cada usuário enxerga |
| `ciclo` | Calendário, análise do ciclo, janela fértil e alerta de irregularidade |
| `gestacao` | Idade gestacional, DPP, movimentos fetais, mamadas e humor |
| `metodos` | Método contraceptivo em uso e controle de medicamentos |
| `lembretes` | Agenda, lembretes automáticos e disparo de notificações |
| `conteudo` | Conteúdos, guia de sintomas, chat automático, perguntas anônimas e UBSs |
| `questionarios` | Quiz de métodos, checklists e escalas de avaliação |

Regras do monólito modular:

1. Cada módulo expõe só uma interface pública; o restante (domínio, repositórios) é interno.
2. Um módulo não importa classes internas de outro.
3. Cada módulo é dono das suas tabelas e só ele as lê e grava. Dados de outro módulo vêm pela interface pública, sem `JOIN` entre módulos.
4. Módulos se falam por chamada em processo; efeitos colaterais usam eventos internos.
5. A `main` é protegida: merge só por pull request com revisão.

As fronteiras entre módulos são verificadas automaticamente com o Spring Modulith.

## Tecnologias

Backend:

- Java 21 e Maven (wrapper incluído)
- Spring Boot 4.1
- Spring Data JPA e Bean Validation
- Spring Modulith (fronteiras entre módulos e eventos internos)
- Flyway (migrações do banco)
- PostgreSQL 17
- Docker Compose (banco local) e Testcontainers (testes)
- Planejado: Spring Security com JWT (OAuth2 Resource Server) e documentação OpenAPI

Clientes (planejado):

- App móvel em React Native com Expo
- Painel web de curadoria

## Estrutura do repositório

```
Commit-And-Pray/
├─ backend/
│  └─ cuidado-feminino-api/
│     ├─ compose.yaml            # PostgreSQL local
│     ├─ .env.example            # variáveis do banco
│     ├─ pom.xml
│     └─ src/
│        ├─ main/
│        │  ├─ java/br/com/unifebe/saude/api/
│        │  │  ├─ CuidadoFemininoApiApplication.java
│        │  │  ├─ contas/        # cada módulo: web, application, domain
│        │  │  ├─ ciclo/
│        │  │  └─ shared/
│        │  └─ resources/
│        │     ├─ application.yml
│        │     ├─ application-dev.yml
│        │     └─ db/migration/  # migrações Flyway
│        └─ test/java/br/com/unifebe/saude/api/
├─ docs/
│  ├─ especificacao/             # requisitos, MER e diagramas
│  └─ decisoes/                  # registros de decisões de arquitetura
├─ AGENTS.md  CLAUDE.md  CODEX.md
└─ README.md
```

Cada módulo fica diretamente sob o pacote base `br.com.unifebe.saude.api`, com esta forma:

```
ciclo/
├─ CicloModuloApi.java   # interface pública do módulo
├─ web/                  # controllers e DTOs
├─ application/          # casos de uso
└─ domain/               # entidades e regras
```

## Como rodar o backend

### Pré-requisitos

- JDK 21
- Docker Desktop (ou Docker Engine com o plugin Compose), aberto e em execução
- Git

### Passo a passo

1. Clone o repositório e entre na pasta do backend:

   ```bash
   git clone https://github.com/AntonioWandrey/Commit-And-Pray.git
   cd Commit-And-Pray/backend/cuidado-feminino-api
   ```

2. Crie o arquivo de variáveis a partir do exemplo:

   ```bash
   # Linux e macOS
   cp .env.example .env

   # Windows (PowerShell ou CMD)
   copy .env.example .env
   ```

3. Suba o banco:

   ```bash
   docker compose up -d
   docker compose ps
   ```

   Aguarde o estado `healthy`.

4. Rode a API com o perfil `dev`:

   ```bash
   # Linux e macOS
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

   # Windows (PowerShell)
   .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
   ```

   No IntelliJ, use **Run → Edit Configurations → Active profiles: `dev`**.

5. Confirme no log as linhas do Flyway aplicando as migrações e `Started CuidadoFemininoApiApplication`.

### Variáveis de ambiente

| Variável | Padrão |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `saude_feminina` |
| `DB_USER` | `saude` |
| `DB_PASSWORD` | `saude_dev` |

O `.env` é lido pelo Docker Compose, mas **não** pelo IntelliJ. O `application.yml` repete os mesmos valores padrão, então a API sobe sem configuração extra.

### Porta 5432 ocupada

Se você já tem um PostgreSQL instalado e usando a porta 5432, a API e o DBeaver vão conectar nele, e a autenticação do usuário `saude` falha. Para resolver:

1. Defina `DB_PORT=5433` no `.env`.
2. Recrie o container: `docker compose down -v` e `docker compose up -d`.
3. No IntelliJ, adicione `DB_PORT=5433` em **Environment variables** da configuração de execução.
4. Use a porta 5433 também no cliente de banco (por exemplo, DBeaver).

### Comandos úteis do Docker

| Comando | Efeito |
|---|---|
| `docker compose stop` | Pausa o banco e mantém os dados |
| `docker compose down` | Remove o container e mantém os dados |
| `docker compose down -v` | Remove tudo, inclusive os dados locais |

## Testes

Os testes usam Testcontainers e precisam do Docker aberto:

```bash
# Linux e macOS
./mvnw verify

# Windows (PowerShell)
.\mvnw.cmd verify
```

## Banco de dados e migrações

O esquema é criado **somente** por migrações Flyway, em `src/main/resources/db/migration/`. O Hibernate roda com `ddl-auto: validate`, apenas conferindo o esquema.

- Nome do arquivo: `V<número>__<descricao>.sql`, com dois sublinhados.
- Uma migração por módulo, na ordem das dependências entre chaves estrangeiras.
- **Nunca edite uma migração que já entrou na `main`.** Para corrigir algo publicado, crie uma migração nova.
- Antes do merge da sua branch, você pode editar a sua migração e recriar o banco local com `docker compose down -v`.

## Convenções do projeto

- **Identificadores em português, sem acento e sem marca de gênero**: por exemplo `usuario`, `usuario_perfil`, `usuario_id`, classe `Usuario`. Na interface e na documentação em prosa, o texto continua "usuária".
- Tabelas e colunas em `snake_case`; chaves primárias `BIGINT GENERATED ALWAYS AS IDENTITY`; datas e horas com `TIMESTAMPTZ`.
- Regras simples no banco (`CHECK`, `UNIQUE`, `NOT NULL`); regras de negócio na aplicação.
- Dados de saúde são sensíveis (LGPD): nada de dados pessoais em logs, fixtures ou capturas de tela.

## Fluxo de trabalho no Git

- A `main` é protegida: toda mudança entra por **pull request** com revisão.
- Nomes de branch: `feat/...`, `fix/...`, `refactor/...`, `docs/...`, em inglês e em minúsculas (por exemplo, `feat/local-database-setup`).
- Mensagens de commit no padrão Conventional Commits, em inglês, sem escopo e em uma linha: `feat: add local PostgreSQL setup with Docker Compose`.
- Pull requests descrevem **o que foi feito, por quê, mudanças e impacto**.
- Commits pequenos e focados; o build precisa passar antes do merge.

## Documentação

- `docs/especificacao/`: especificação de requisitos e modelagem (requisitos funcionais e não funcionais, regras de negócio, casos de uso, MER, diagrama de classes e de componentes).
- `docs/decisoes/`: registros de decisões de arquitetura.
- `AGENTS.md`, `CLAUDE.md` e `CODEX.md`: instruções para assistentes de código.

## Privacidade e LGPD

O app guarda dados de saúde íntima, que a LGPD trata como dados pessoais sensíveis. O projeto prevê consentimento específico no cadastro, finalidade declarada, exportação e exclusão de dados a pedido, modo confidencial e anonimato nas perguntas anônimas (a tabela de perguntas anônimas não tem chave para o usuário).

Pontos ainda em aberto, como o consentimento de menores de 18 anos, estão listados na especificação e dependem de apoio jurídico.