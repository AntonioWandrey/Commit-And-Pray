# API do Minha Saúde Feminina

A API tem 76 rotas sob `/api/v1`, distribuídas pelos dez módulos do backend. As 27 rotas da fase Agora (contas, canais, diário e ciclo) têm contrato completo; as outras 49 têm rota, caso de uso e requisito, sem JSON.

Nada desta aba vem dos documentos de origem. Tudo é **Derivado** dos casos de uso e requisitos da aba principal, do guia do chatbot (G) e do acordo do time (T), e precisa da aprovação do grupo antes de virar código.

## 1. Convenções gerais

Toda rota segue as mesmas regras de endereço, formato e resposta, para que app, bot e painel tratem a API do mesmo jeito.

| Tema | Regra |
| --- | --- |
| Endereço base | `/api/v1`. No ambiente local, `http://127.0.0.1:8080/api/v1` |
| Formato | JSON em UTF-8. Campos em camelCase, em português e sem acento (`dataNascimento`, `mensagemId`) |
| Identificadores | Trafegam como texto (`"101"`), como no contrato do bot (T) |
| Datas | Dia: `AAAA-MM-DD`. Instante: ISO 8601 com fuso (`2026-11-20T09:30:00-03:00`) |
| Enumerações | Em maiúsculas, com os valores da seção 7 da aba principal (`GESTANTE`, `PILULA`). Exceção: `humor`, em minúsculas, como o guia do chatbot definiu |
| Métodos | `GET` consulta. `POST` cria e responde `201`. `PUT` grava o recurso inteiro e pode ser repetido. `PATCH` altera parte. `DELETE` remove e responde `204` |
| Listas longas | Paginadas com `pagina` (começa em 0) e `tamanho` (padrão 20, máximo 100), das mais recentes para as mais antigas |
| Catálogos e listas curtas | Devolvem só `itens`, sem paginação (perfis, condições, vínculos) |
| Versão | Fica no caminho. Mudança incompatível só entra em `/api/v2` (RNF18) |
| Documentação viva | Swagger UI em `/swagger-ui.html`, só nos perfis `dev` e `piloto`. O `springdoc` já está no `pom.xml` |

Toda lista paginada usa este envelope:

```json
{
  "itens": [],
  "pagina": 0,
  "tamanho": 20,
  "total": 0
}
```

## 2. Autenticação e autorização

Toda rota exige identificação, menos cadastro, login e os catálogos usados na tela de cadastro. A conta dona dos dados vem sempre do token, nunca de um campo ou parâmetro enviado pelo cliente.

| Chamador | Como se identifica | O que acessa |
| --- | --- | --- |
| Conta (app) | `Authorization: Bearer <JWT>`, recebido no login | As rotas da própria conta |
| Canal de conversa (bot e simulador) | `Authorization: Bearer <token do canal>`, fixo e guardado em configuração | Só `POST /bot/eventos` |
| Equipe de saúde | JWT com papel de curadoria, recebido em `/admin/auth/login` | As rotas `/admin/**` |
| Público | Nada | Cadastro, login, catálogo de perfis e catálogo de condições |

Regras:

- **JWT da conta:** assinado pela própria API (HS256), com o segredo em variável de ambiente. Carrega `sub` (id da conta), `papel` e `exp`. Vale 60 minutos e não há refresh token no piloto (proposta).
- **Token do canal:** diz qual é o canal (`SIMULADOR` ou `WHATSAPP`). A pessoa é identificada pelo `remetenteRef` do corpo, e o servidor encontra a conta pelo vínculo.
- **Simulador:** o token do canal `SIMULADOR` só é aceito nos perfis `dev` e `piloto`.
- **Titularidade:** um recurso de outra conta responde `404`, igual a um recurso que não existe, para não revelar que ele existe.
- **Senha:** nunca volta em resposta. O banco guarda só o hash (RNF06).
- **Modo confidencial (RNF07):** o app não guarda o token e pede a senha a cada abertura. A API não muda.

## 3. Erros

Todo erro responde com o mesmo corpo: `codigo`, para o programa, e `mensagem`, para a pessoa (T). Erros de validação trazem também a lista `campos`.

```json
{
  "codigo": "REQUISICAO_INVALIDA",
  "mensagem": "Confira os campos destacados.",
  "campos": [
    { "campo": "dataNascimento", "mensagem": "Informe uma data no passado." }
  ]
}
```

| Status | `codigo` | Quando acontece |
| --- | --- | --- |
| 400 | `REQUISICAO_INVALIDA` | Campo ausente, formato errado ou regra de preenchimento, como idade menor que 10 anos (RN02) |
| 400 | `CODIGO_INVALIDO` | Código de vínculo errado, vencido ou já usado |
| 401 | `NAO_AUTENTICADO` | Token ausente, inválido ou vencido |
| 401 | `CREDENCIAIS_INVALIDAS` | E-mail ou senha errados |
| 403 | `ACESSO_NEGADO` | Token válido, mas sem o papel que a rota exige |
| 403 | `REMETENTE_SEM_VINCULO` | O remetente do bot não está ligado a nenhuma conta. Nada é gravado |
| 404 | `NAO_ENCONTRADO` | Recurso que não existe ou que é de outra conta |
| 409 | `EMAIL_JA_CADASTRADO` | Cadastro com e-mail já usado |
| 409 | `MENSAGEM_DIVERGENTE` | Mesmo `mensagemId` com conteúdo diferente do original |
| 409 | `CONFLITO_DE_ESTADO` | A operação não cabe no estado atual, como um ciclo com datas sobrepostas a outro |
| 500 | `ERRO_INTERNO` | Falha não prevista. A mensagem é genérica |
| 503 | `SERVICO_INDISPONIVEL` | Banco ou dependência fora do ar. O bot não confirma o registro |

O time combinou os status 400, 401, 403, 409 e 503. A lista `campos`, o 404 e o 500 são acréscimos desta proposta.

Nenhuma mensagem de erro e nenhum log repete `relato`, `observacao` ou outro dado de saúde recebido (RNF05).

## 4. Idempotência do bot

Reenviar a mesma mensagem não cria outra entrada (RNF17). A chave é a combinação de canal, `remetenteRef` e `mensagemId` (T).

| Situação | Resposta |
| --- | --- |
| Primeira vez que a chave chega | `201`, com `duplicado: false` |
| Mesma chave e mesmo conteúdo | `200`, com o mesmo `registroId` e `duplicado: true` |
| Mesma chave e conteúdo diferente | `409 MENSAGEM_DIVERGENTE`. A entrada original não muda |
| Mesmo `mensagemId` vindo de outro remetente | São mensagens diferentes: cada uma grava a sua entrada |
| Falha ao gravar | `503`. O bot pode reenviar com o mesmo `mensagemId` |

A unicidade fica no banco, em um índice único sobre os três campos, e não só no código.

## 5. Rotas por módulo

Cada módulo do backend é dono de um conjunto de prefixos. Os caminhos abaixo omitem `/api/v1`. A fase (Agora ou Depois) repete a proposta de Estrutura do repositório Commit-And-Pray — proposta para o time.

| Módulo | Prefixos | Rotas | Fase |
| --- | --- | --- | --- |
| `contas` | `/auth`, `/contas`, `/condicoes`, `/admin/auth` | 16 | Agora (2 ficam para depois) |
| `canais` | `/bot` | 1 | Agora |
| `diario` | `/diario` | 1 | Agora |
| `ciclo` | `/ciclo` | 11 | Agora |
| `personalizacao` | `/perfis`, `/painel` | 2 | Depois |
| `gestacao` | `/gestacao` | 8 | Depois |
| `metodos` | `/metodos`, `/medicamentos` | 8 | Depois |
| `lembretes` | `/lembretes`, `/notificacoes` | 7 | Depois |
| `conteudo` | `/conteudos`, `/guia-sintomas`, `/chat`, `/perguntas-anonimas`, `/ubs`, `/admin` | 18 | Depois |
| `questionarios` | `/questionarios` | 4 | Depois |

Nas tabelas a seguir, a coluna Origem traz o caso de uso e os requisitos que justificam a rota.

### contas

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `POST /auth/cadastro` | Público | Cria a conta com o consentimento, o perfil etário, a situação e as condições | UC01 · RF01, RF03, RF04, RF09 |
| `POST /auth/login` | Público | Confere e-mail e senha e devolve o token | UC03 · RF07 |
| `GET /contas/me` | Conta | Devolve os dados da conta | UC02 · RF01, RF04 |
| `PATCH /contas/me` | Conta | Altera nome, nome social, identidade de gênero, visual neutro, modo confidencial e UBS de referência | UC02 · RF04, RF07, RF08 |
| `PUT /contas/me/senha` | Conta | Troca a senha, conferindo a atual | UC03 · RF07 |
| `GET /contas/me/perfis` | Conta | Lista os perfis ativos | UC02 · RF05 |
| `PUT /contas/me/situacao` | Conta | Troca a situação atual e encerra a anterior (RN05) | UC02 · RF03, RF06 |
| `GET /contas/me/condicoes` | Conta | Lista as condições de saúde declaradas | UC02 · RF09 |
| `PUT /contas/me/condicoes` | Conta | Grava a lista de condições | UC02 · RF09 |
| `GET /condicoes` | Público | Catálogo de condições para a tela de cadastro | UC01 · RF09 |
| `POST /contas/me/vinculos/codigos` | Conta | Gera um código de uso único para ligar um canal de conversa | UC25 · RF51 |
| `GET /contas/me/vinculos` | Conta | Lista os canais ligados à conta | UC25 · RF51 |
| `DELETE /contas/me/vinculos/{id}` | Conta | Desfaz um vínculo | UC25 · RF51 |
| `POST /contas/me/exclusao` | Conta | Exclui a conta e todos os dados, conferindo a senha | RN24, RNF05 |
| `GET /contas/me/exportacao` | Conta | Exporta os dados da conta. Fase Depois | RNF05 |
| `POST /admin/auth/login` | Público | Login da equipe de saúde. Fase Depois | UC21, UC22 · RF16, RF47 |

### canais

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `POST /bot/eventos` | Canal | Recebe uma mensagem do bot: humor, queixa ou código de vínculo | UC23, UC25 · RF48, RF49, RF51 |

O adaptador do WhatsApp, fora do piloto, converte a mensagem do provedor para este mesmo contrato. Ele não ganha rota própria nesta versão.

### diario

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `GET /diario/historico` | Conta | Lista as entradas da conta, com data, tipo e origem | UC24 · RF50 |

### ciclo

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `PUT /ciclo/configuracao` | Conta | Grava a duração média do ciclo informada no cadastro | UC01 · RF02 |
| `POST /ciclo/ciclos` | Conta | Abre um ciclo na data de início da menstruação e encerra o anterior | UC01, UC05 · RF02, RF17 |
| `GET /ciclo/ciclos` | Conta | Lista os ciclos registrados | UC05 · RF17 |
| `PATCH /ciclo/ciclos/{id}` | Conta | Corrige as datas de um ciclo | UC05 · RF17 |
| `DELETE /ciclo/ciclos/{id}` | Conta | Remove um ciclo registrado por engano | UC05 · RF17 |
| `PUT /ciclo/registros/{data}` | Conta | Grava o registro do dia: fluxo, sintomas, humor, ansiedade e relação sexual | UC05, UC09, UC10 · RF17, RF20, RF21, RF23, RF25, RF31, RF35 |
| `GET /ciclo/registros` | Conta | Lista os registros de um período | UC05 · RF17, RF20 |
| `DELETE /ciclo/registros/{data}` | Conta | Apaga o registro do dia | UC05 · RF17 |
| `GET /ciclo/calendario` | Conta | Devolve o mês com menstruação registrada e prevista, janela fértil e dias com registro | UC05, UC06 · RF17, RF22, RF23 |
| `GET /ciclo/previsao` | Conta | Devolve duração média, regularidade, próxima menstruação, janela fértil e alerta de irregularidade | UC06, UC18 · RF18, RF19, RF22 |
| `GET /ciclo/sintomas` | Conta | Catálogo de sintomas por categoria | UC05 · RF17, RF21 |

### personalizacao

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `GET /perfis` | Público | Catálogo de perfis para a tela de cadastro | UC01 · RF03 |
| `GET /painel` | Conta | Devolve os painéis liberados pela união dos perfis ativos (RN06) | UC17 · RF05, RF06 |

O UC17 não tem rota de escrita: o servidor recalcula os painéis dentro do cadastro e da troca de situação.

### gestacao

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `POST /gestacao` | Conta | Inicia o acompanhamento com a DUM | UC01, UC09 · RF28 |
| `GET /gestacao/atual` | Conta | Devolve idade gestacional, DPP e fase (gestação ou puerpério) | UC09 · RF28 |
| `PATCH /gestacao/atual` | Conta | Corrige a DUM ou registra o parto, o que ativa o puerpério (RN08) | UC09 · RF28 |
| `GET /gestacao/atual/pre-natal` | Conta | Lista as consultas e os exames previstos do pré-natal | UC09 · RF29 |
| `POST /gestacao/atual/movimentos` | Conta | Registra uma contagem de movimentos fetais | UC09 · RF30 |
| `GET /gestacao/atual/movimentos` | Conta | Lista as contagens | UC09 · RF30 |
| `POST /gestacao/atual/mamadas` | Conta | Registra uma mamada | UC10 · RF34 |
| `GET /gestacao/atual/mamadas` | Conta | Lista as mamadas | UC10 · RF34 |

Sintomas da gestação (RF31) e humor no puerpério (RF35) usam o registro do dia do módulo `ciclo`, porque o MER guarda os dois em REGISTRO\_DIARIO.

### metodos

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `GET /metodos` | Conta | Catálogo de métodos com tipo, eficácia e intervalo | UC08 · RF14, RF27 |
| `GET /metodos/uso` | Conta | Devolve o método em uso e a próxima data | UC08 · RF27 |
| `PUT /metodos/uso` | Conta | Registra ou troca o método, encerra o anterior e refaz os lembretes (RN13) | UC08 · RF03, RF27 |
| `DELETE /metodos/uso` | Conta | Encerra o uso do método | UC08 · RF27 |
| `GET /medicamentos` | Conta | Lista os medicamentos da conta | UC12 · RF40 |
| `POST /medicamentos` | Conta | Cadastra medicamento, dose e horário | UC12 · RF40 |
| `PATCH /medicamentos/{id}` | Conta | Altera os dados, registra efeitos colaterais ou desativa | UC12 · RF40 |
| `DELETE /medicamentos/{id}` | Conta | Remove o medicamento | UC12 · RF40 |

### lembretes

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `GET /lembretes` | Conta | Lista por período, tipo e status, incluindo os automáticos do perfil | UC11 · RF37, RF38, RF39, RF41 |
| `POST /lembretes` | Conta | Cria lembrete de exame, vacina ou consulta | UC11 · RF37, RF39, RF41 |
| `PATCH /lembretes/{id}` | Conta | Edita, conclui ou adia | UC11, UC19 · RF37 |
| `DELETE /lembretes/{id}` | Conta | Remove o lembrete | UC11 · RF37 |
| `GET /notificacoes` | Conta | Lista as notificações enviadas pelo agendador | UC19 · RF19, RF27, RF32, RF33, RF38 |
| `PATCH /notificacoes/{id}` | Conta | Marca a notificação como lida | UC19 |
| `PUT /notificacoes/dispositivo` | Conta | Registra o aparelho que recebe as notificações | UC19 |

O envio das notificações (UC19) parte do agendador, não de uma chamada do app. Por isso não há rota de envio.

### conteudo

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `GET /conteudos` | Conta | Lista os conteúdos publicados dos perfis ativos, com filtro por categoria e busca | UC04 · RF10, RF11, RF14, RF15 |
| `GET /conteudos/{id}` | Conta | Devolve o conteúdo completo e a data da última revisão | UC04 · RF10, RF11 |
| `GET /guia-sintomas` | Conta | Lista os sintomas do guia e marca os sinais de alerta | UC13 · RF12, RF13 |
| `GET /guia-sintomas/{id}` | Conta | Devolve a conduta do sintoma e o link de agendamento da UBS | UC13, UC20 · RF12, RF13, RF45 |
| `POST /chat/consultas` | Conta | Devolve conteúdos aprovados para a dúvida (RN22). Nada é gravado | UC15 · RF44 |
| `POST /perguntas-anonimas` | Conta | Grava a pergunta só com o perfil etário (RN23) | UC14 · RF43 |
| `GET /perguntas-anonimas/respondidas` | Conta | Lista as perguntas respondidas e publicadas | UC14 · RF43 |
| `GET /ubs` | Conta | Lista as UBSs, com filtro das acolhedoras LGBTQIA+ | UC20 · RF45, RF46 |
| `GET /admin/conteudos` | Equipe de saúde | Lista os conteúdos, publicados ou não | UC21 · RF16 |
| `POST /admin/conteudos` | Equipe de saúde | Cria um conteúdo e o associa aos perfis | UC21 · RF16 |
| `PUT /admin/conteudos/{id}` | Equipe de saúde | Altera o conteúdo e os perfis | UC21 · RF16 |
| `POST /admin/conteudos/{id}/publicacao` | Equipe de saúde | Marca como revisado e publica (RN21) | UC21 · RF16 |
| `DELETE /admin/conteudos/{id}/publicacao` | Equipe de saúde | Tira o conteúdo do ar | UC21 · RF16 |
| `GET /admin/perguntas-anonimas` | Equipe de saúde | Lista a fila de moderação por status | UC22 · RF47 |
| `POST /admin/perguntas-anonimas/{id}/resposta` | Equipe de saúde | Responde e publica | UC22 · RF47 |
| `POST /admin/perguntas-anonimas/{id}/arquivamento` | Equipe de saúde | Arquiva sem publicar | UC22 · RF47 |
| `POST /admin/ubs` | Equipe de saúde | Cadastra uma UBS e o link de agendamento | UC20 · RF45, RF46 |
| `PUT /admin/ubs/{id}` | Equipe de saúde | Altera os dados da UBS | UC20 · RF45, RF46 |

### questionarios

| Rota | Chamador | O que faz | Origem |
| --- | --- | --- | --- |
| `GET /questionarios` | Conta | Lista quiz, checklists e escalas disponíveis para os perfis da conta | UC07, UC16 · RF24, RF26, RF36, RF42 |
| `GET /questionarios/{id}` | Conta | Devolve as questões e as opções | UC07, UC16 · RF24, RF26, RF36, RF42 |
| `POST /questionarios/{id}/preenchimentos` | Conta | Grava as respostas e devolve o resultado (RN14, RN19) | UC07, UC16 · RF24, RF26, RF35, RF36, RF42 |
| `GET /questionarios/{id}/preenchimentos` | Conta | Lista os preenchimentos anteriores da conta | UC16 · RF24, RF36 |

## 6. Contratos detalhados da fase Agora

Esta seção fixa o JSON das 27 rotas de `contas`, `canais`, `diario` e `ciclo`. Todos os exemplos usam dados fictícios. Erros comuns a qualquer rota (400, 401, 500 e 503) estão na seção 3 e não se repetem aqui.

### contas

**`POST /auth/cadastro`** responde `201` com o objeto Conta. O corpo junta os passos 3 a 8 do UC01, menos os dados do ciclo, que vão para o módulo `ciclo`.

```json
{
  "nome": "Ana Teste",
  "nomeSocial": null,
  "identidadeGenero": null,
  "dataNascimento": "1998-04-12",
  "email": "ana@example.com",
  "senha": "uma-senha-longa",
  "consentimentoSaude": true,
  "versaoTermo": "2026-11",
  "situacao": "EVITANDO_GRAVIDEZ",
  "condicaoIds": ["3"],
  "ubsId": null
}
```

O objeto Conta é o mesmo em `GET /contas/me` e `PATCH /contas/me`:

```json
{
  "id": "12",
  "nome": "Ana Teste",
  "nomeSocial": null,
  "identidadeGenero": null,
  "dataNascimento": "1998-04-12",
  "idade": 28,
  "email": "ana@example.com",
  "visualNeutro": false,
  "modoConfidencial": false,
  "ubsId": null,
  "perfis": ["ADULTA", "EVITANDO_GRAVIDEZ", "DOENCA_GINECOLOGICA"],
  "criadoEm": "2026-11-20T09:30:00-03:00"
}
```

| Regra do cadastro | Resposta |
| --- | --- |
| `consentimentoSaude` diferente de `true` (UC01, fluxo 2a) | `400`. A conta não é criada |
| Idade menor que 10 anos (RN02) | `400` |
| Senha com menos de 8 caracteres (limite proposto) | `400` |
| E-mail já usado, sem diferenciar maiúsculas | `409 EMAIL_JA_CADASTRADO` |
| `situacao` | Um destes ou `null`: `GESTANTE`, `PUERPERIO`, `TENTANTE`, `EVITANDO_GRAVIDEZ` |
| Perfil etário e perfis de condição | Calculados pelo servidor (RN01, RN04). O cliente não os envia |

**`POST /auth/login`** responde `200`. E-mail desconhecido e senha errada dão a mesma resposta, `401 CREDENCIAIS_INVALIDAS`.

```json
{ "email": "ana@example.com", "senha": "uma-senha-longa" }
```

```json
{
  "token": "<JWT>",
  "tipo": "Bearer",
  "expiraEm": "2026-11-20T10:30:00-03:00",
  "conta": { "id": "12", "nome": "Ana Teste", "nomeSocial": null, "visualNeutro": false, "modoConfidencial": false, "perfis": ["ADULTA", "EVITANDO_GRAVIDEZ"] }
}
```

**`POST /contas/me/vinculos/codigos`** responde `201`. O código tem 6 dígitos, vale 10 minutos e serve uma vez. O banco guarda só o hash, e um código novo anula o anterior (proposta).

```json
{ "canal": "WHATSAPP" }
```

```json
{ "codigo": "483920", "canal": "WHATSAPP", "expiraEm": "2026-11-20T09:40:00-03:00" }
```

A pessoa envia esse código na conversa, e o bot o repassa em `POST /bot/eventos` com `tipo: VINCULO`. Assim só quem está logada no app e tem o aparelho do canal em mãos consegue criar o vínculo. No piloto, os vínculos vêm dos dados fictícios (seção 8) e o bot ainda não usa esse tipo.

Demais rotas de `contas`:

| Rota | Corpo enviado | Resposta |
| --- | --- | --- |
| `GET /contas/me` | Nenhum | `200` com o objeto Conta |
| `PATCH /contas/me` | Qualquer parte de `nome`, `nomeSocial`, `identidadeGenero`, `visualNeutro`, `modoConfidencial`, `ubsId` | `200` com o objeto Conta |
| `PUT /contas/me/senha` | `senhaAtual`, `novaSenha` | `204`. Senha atual errada: `401 CREDENCIAIS_INVALIDAS` |
| `GET /contas/me/perfis` | Nenhum | `200` com `itens`: `codigo`, `nome`, `tipo`, `dataInicio` |
| `PUT /contas/me/situacao` | `situacao` (um código ou `null`) | `200` com `perfis` atualizado |
| `GET /contas/me/condicoes` | Nenhum | `200` com `itens`: `condicaoId`, `nome`, `dataDiagnostico`, `emTratamento` |
| `PUT /contas/me/condicoes` | `condicoes`: lista de `condicaoId`, `dataDiagnostico`, `emTratamento` | `200` com a lista gravada e `perfis` atualizado |
| `GET /condicoes` | Nenhum | `200` com `itens`: `id`, `nome`, `cronica` |
| `GET /contas/me/vinculos` | Nenhum | `200` com `itens`: `id`, `canal`, `remetente` (só os 4 últimos caracteres), `vinculadoEm` |
| `DELETE /contas/me/vinculos/{id}` | Nenhum | `204` |
| `POST /contas/me/exclusao` | `senha` | `204`. Apaga os dados da conta em todos os módulos (RN24) |

### canais

**`POST /bot/eventos`** recebe uma mensagem do bot com o token do canal. O corpo não traz conta: o servidor a encontra pelo vínculo do `remetenteRef` (T).

```json
{
  "mensagemId": "demo-001",
  "remetenteRef": "simulador-001",
  "recebidaEm": "2026-11-20T09:30:00-03:00",
  "tipo": "HUMOR",
  "humor": "bem"
}
```

| Campo | Obrigatório | Regra |
| --- | --- | --- |
| `mensagemId` | Sempre | Identificador estável da mensagem, até 100 caracteres |
| `remetenteRef` | Sempre | Identificador do remetente no canal, até 100 caracteres |
| `recebidaEm` | Sempre | Instante com fuso |
| `tipo` | Sempre | `HUMOR`, `QUEIXA` ou `VINCULO` |
| `humor` | Só em `HUMOR` | `bem`, `normal`, `cansada` ou `desconfortavel` |
| `relato` | Só em `QUEIXA` | Texto de até 1.000 caracteres (limite proposto) |
| `codigo` | Só em `VINCULO` | Os 6 dígitos gerados no app |

Um campo que pertence a outro tipo torna a requisição inválida (`400`).

Resposta de `HUMOR` e `QUEIXA`, que não repete o relato:

```json
{ "registroId": "101", "duplicado": false }
```

| Caso | Resposta |
| --- | --- |
| Entrada gravada | `201` com `duplicado: false` |
| Reenvio da mesma mensagem | `200` com o mesmo `registroId` e `duplicado: true` |
| Mesmo `mensagemId` com outro conteúdo | `409 MENSAGEM_DIVERGENTE` |
| Remetente sem vínculo | `403 REMETENTE_SEM_VINCULO`. Nada é gravado |
| Token do canal ausente ou errado | `401 NAO_AUTENTICADO` |
| Falha ao gravar | `503 SERVICO_INDISPONIVEL`. O bot não confirma o registro |
| `VINCULO` com código válido | `200` com `{ "vinculado": true }` |
| `VINCULO` com código errado, vencido ou usado | `400 CODIGO_INVALIDO` |
| `VINCULO` de remetente já ligado a outra conta | `409 CONFLITO_DE_ESTADO` |

O bot só diz que registrou depois de receber `201` ou `200`.

### diario

**`GET /diario/historico`** responde `200` com as entradas da conta do token, das mais recentes para as mais antigas. Aceita os filtros `tipo`, `de` e `ate`, além de `pagina` e `tamanho`. Nenhum parâmetro escolhe a conta.

```json
{
  "itens": [
    {
      "registroId": "102",
      "tipo": "QUEIXA",
      "relato": "Texto fictício de exemplo.",
      "origem": "SIMULADOR",
      "recebidaEm": "2026-11-20T09:31:00-03:00"
    },
    {
      "registroId": "101",
      "tipo": "HUMOR",
      "humor": "bem",
      "origem": "SIMULADOR",
      "recebidaEm": "2026-11-20T09:30:00-03:00"
    }
  ],
  "pagina": 0,
  "tamanho": 20,
  "total": 2
}
```

`origem` é o canal por onde a entrada chegou: `SIMULADOR` ou `WHATSAPP`.

### ciclo

Os campos abaixo estão fechados; os números dependem das fórmulas RN10, RN11 e RN12, que ainda esperam a validação da Medicina.

**`POST /ciclo/ciclos`** responde `201`. O app chama a rota quando a pessoa marca o início da menstruação. O servidor encerra o ciclo anterior na véspera e calcula a duração dele. Datas sobrepostas a outro ciclo respondem `409 CONFLITO_DE_ESTADO`.

```json
{ "dataInicio": "2026-11-03" }
```

```json
{ "id": "31", "dataInicio": "2026-11-03", "dataFim": null, "duracaoDias": null }
```

**`PUT /ciclo/registros/{data}`** responde `200` e grava o registro inteiro do dia. Repetir a chamada substitui o registro, o que serve à sincronização depois de um período sem internet (RNF14).

```json
{
  "fluxo": "MODERADO",
  "humor": "cansada",
  "ansiedade": 2,
  "relacaoSexual": false,
  "observacao": null,
  "sintomas": [
    { "sintomaId": "5", "intensidade": 2 }
  ]
}
```

A resposta devolve o registro gravado e a lista `alertas`. Ela vem preenchida quando um sintoma marcado é sinal de alerta (RN18), com o texto mantido pela curadoria:

```json
{
  "data": "2026-11-05",
  "fluxo": "MODERADO",
  "humor": "cansada",
  "ansiedade": 2,
  "relacaoSexual": false,
  "observacao": null,
  "sintomas": [
    { "sintomaId": "5", "nome": "Cólica", "intensidade": 2 }
  ],
  "alertas": []
}
```

**`GET /ciclo/previsao`** responde `200`. No exemplo, o último ciclo começou em 03/11/2026 e a média é de 28 dias.

```json
{
  "duracaoMediaDias": 28,
  "ciclosConsiderados": 4,
  "regular": true,
  "proximaMenstruacao": "2026-12-01",
  "ovulacaoEstimada": "2026-11-17",
  "janelaFertil": { "inicio": "2026-11-12", "fim": "2026-11-18" },
  "irregularidade": null
}
```

Quando a regra RN12 dispara, `irregularidade` traz `motivo`, `mensagem` e `linkAgendamento`. Sem nenhum ciclo registrado, as datas vêm `null`.

**`GET /ciclo/calendario?mes=2026-11`** responde `200` com um item por dia do mês.

```json
{
  "mes": "2026-11",
  "dias": [
    {
      "data": "2026-11-03",
      "menstruacao": true,
      "menstruacaoPrevista": false,
      "janelaFertil": false,
      "ovulacaoEstimada": false,
      "temRegistro": true
    }
  ]
}
```

Demais rotas de `ciclo`:

| Rota | Corpo ou parâmetros | Resposta |
| --- | --- | --- |
| `PUT /ciclo/configuracao` | `duracaoMediaDias`, de 10 a 90 (faixa proposta) | `200` com o valor gravado |
| `GET /ciclo/ciclos` | `pagina`, `tamanho` | `200` com a lista paginada de ciclos |
| `PATCH /ciclo/ciclos/{id}` | `dataInicio`, `dataFim` | `200` com o ciclo. Sobreposição: `409 CONFLITO_DE_ESTADO` |
| `DELETE /ciclo/ciclos/{id}` | Nenhum | `204` |
| `GET /ciclo/registros` | `de`, `ate` (no máximo 366 dias) | `200` com `itens`, um registro por dia |
| `DELETE /ciclo/registros/{data}` | Nenhum | `204` |
| `GET /ciclo/sintomas` | `categoria` (opcional) | `200` com `itens`: `id`, `nome`, `categoria`, `sinalAlerta` |

As escalas de `humor`, `ansiedade` e `intensidade` não estão no MER. O exemplo usa os quatro valores de humor do guia do chatbot e notas de 0 a 3, como proposta.

## 7. Rastreabilidade

Os 51 requisitos funcionais têm onde ser atendidos: 49 por rotas e 2 (RF32 e RF33) só pelo agendador, que não é chamado pelo app. Uma rota nova só entra na API se apontar para um requisito desta tabela.

| Requisito | Onde é atendido |
| --- | --- |
| RF01 Cadastro e idade | `POST /auth/cadastro`, `GET /contas/me` |
| RF02 Última menstruação e duração do ciclo | `POST /ciclo/ciclos`, `PUT /ciclo/configuracao` |
| RF03 Situação atual | `POST /auth/cadastro`, `PUT /contas/me/situacao`, `GET /perfis`. O método em uso vai em `PUT /metodos/uso` |
| RF04 Identidade de gênero e nome social | `POST /auth/cadastro`, `GET /contas/me`, `PATCH /contas/me` |
| RF05 Painéis conforme o cadastro | `GET /painel`, `GET /contas/me/perfis` |
| RF06 Atualizar a situação | `PUT /contas/me/situacao`, `GET /painel` |
| RF07 Senha e modo confidencial | `POST /auth/login`, `PUT /contas/me/senha`, `PATCH /contas/me` |
| RF08 Visual neutro | `PATCH /contas/me` liga a opção. A troca das palavras é feita no app (RN09) |
| RF09 Condições de saúde | `POST /auth/cadastro`, `GET /condicoes`, `GET /contas/me/condicoes`, `PUT /contas/me/condicoes` |
| RF10 Conteúdos por perfil | `GET /conteudos`, `GET /conteudos/{id}` |
| RF11 Texto, imagem e animação | `GET /conteudos` e `GET /conteudos/{id}` devolvem o formato. A exibição é feita no app |
| RF12 Guia de sintomas | `GET /guia-sintomas`, `GET /guia-sintomas/{id}` |
| RF13 Sinais de alerta da gestação | `GET /guia-sintomas`, `GET /guia-sintomas/{id}` |
| RF14 Comparativo de métodos | `GET /metodos`, `GET /conteudos` |
| RF15 Busca de conteúdos | `GET /conteudos` |
| RF16 Curadoria de conteúdos | `POST /admin/auth/login` e as cinco rotas de `/admin/conteudos` |
| RF17 Calendário menstrual | As rotas de `/ciclo/ciclos` e `/ciclo/registros`, `GET /ciclo/calendario`, `GET /ciclo/sintomas` |
| RF18 Análise do padrão do ciclo | `GET /ciclo/previsao` |
| RF19 Alerta de irregularidade | `GET /ciclo/previsao`. O aviso do agendador aparece em `GET /notificacoes` |
| RF20 Diário de sintomas | `PUT /ciclo/registros/{data}`, `GET /ciclo/registros` |
| RF21 Sintomas da menopausa | `PUT /ciclo/registros/{data}`, `GET /ciclo/sintomas` |
| RF22 Janela fértil | `GET /ciclo/previsao`, `GET /ciclo/calendario` |
| RF23 Tentativas e mapa de ovulação | `PUT /ciclo/registros/{data}`, `GET /ciclo/calendario` |
| RF24 Checklist pré-concepcional | As quatro rotas de `/questionarios` |
| RF25 Diário de humor e ansiedade | `PUT /ciclo/registros/{data}` |
| RF26 Quiz de métodos | `GET /questionarios`, `GET /questionarios/{id}`, `POST /questionarios/{id}/preenchimentos` |
| RF27 Método em uso e alertas | `GET /metodos` e as três rotas de `/metodos/uso`. Os alertas do agendador aparecem em `GET /notificacoes` |
| RF28 Idade gestacional e DPP | `POST /gestacao`, `GET /gestacao/atual`, `PATCH /gestacao/atual` |
| RF29 Calendário do pré-natal | `GET /gestacao/atual/pre-natal` |
| RF30 Movimentos fetais | `POST /gestacao/atual/movimentos`, `GET /gestacao/atual/movimentos` |
| RF31 Sintomas da gestação | `PUT /ciclo/registros/{data}` |
| RF32 Notificações semanais da gestação | Sem rota de envio: parte do agendador. O resultado aparece em `GET /notificacoes` |
| RF33 Lembrete da consulta puerperal | Sem rota de envio: parte do agendador. O resultado aparece em `GET /notificacoes` |
| RF34 Mamadas | `POST /gestacao/atual/mamadas`, `GET /gestacao/atual/mamadas` |
| RF35 Humor no puerpério | `PUT /ciclo/registros/{data}`, `POST /questionarios/{id}/preenchimentos` |
| RF36 Checklists de vacinação | As quatro rotas de `/questionarios` |
| RF37 Lembretes de exames, vacinas e consultas | `GET /lembretes`, `POST /lembretes`, `PATCH /lembretes/{id}`, `DELETE /lembretes/{id}` |
| RF38 Lembretes automáticos | Gerados pelo agendador. Aparecem em `GET /lembretes` e `GET /notificacoes` |
| RF39 Exames de quem vive com HIV | `GET /lembretes`, `POST /lembretes` |
| RF40 Medicamentos | As quatro rotas de `/medicamentos` |
| RF41 Exames de imagem e consultas | `GET /lembretes`, `POST /lembretes` |
| RF42 Avaliação funcional | `GET /questionarios`, `GET /questionarios/{id}`, `POST /questionarios/{id}/preenchimentos` |
| RF43 Perguntas anônimas | `POST /perguntas-anonimas`, `GET /perguntas-anonimas/respondidas` |
| RF44 Chat "É normal isso?" | `POST /chat/consultas` |
| RF45 Link de agendamento na UBS | `GET /ubs`, `GET /guia-sintomas/{id}`, `POST /admin/ubs`, `PUT /admin/ubs/{id}` |
| RF46 UBSs acolhedoras | `GET /ubs`, `POST /admin/ubs`, `PUT /admin/ubs/{id}` |
| RF47 Moderação das perguntas | `POST /admin/auth/login` e as três rotas de `/admin/perguntas-anonimas` |
| RF48 Humor por conversa | `POST /bot/eventos` |
| RF49 Queixa por conversa | `POST /bot/eventos` |
| RF50 Histórico do diário | `GET /diario/historico` |
| RF51 Vínculo do canal com a conta | `POST /contas/me/vinculos/codigos`, `GET /contas/me/vinculos`, `DELETE /contas/me/vinculos/{id}`, `POST /bot/eventos` |

Quatro rotas não apontam para um requisito funcional. `POST /contas/me/exclusao` e `GET /contas/me/exportacao` vêm da RNF05 e da RN24. `PATCH /notificacoes/{id}` e `PUT /notificacoes/dispositivo` são apoio ao UC19.

Requisitos não funcionais que moldam o contrato:

| Requisito | Efeito na API |
| --- | --- |
| RNF05 Privacidade | Consentimento obrigatório no cadastro, rotas de exportação e exclusão, e nenhum dado de saúde em erro ou log |
| RNF06 Segurança | HTTPS fora do ambiente local, senha só como hash e token com validade |
| RNF07 Confidencialidade | `modoConfidencial` na conta. As notificações saem com texto genérico |
| RNF08 Anonimato | `POST /perguntas-anonimas` não grava a conta nem devolve identificador da pergunta |
| RNF09 Confiabilidade do conteúdo | Conteúdo só aparece depois de `POST /admin/conteudos/{id}/publicacao` e sempre traz a data da revisão |
| RNF13 Desempenho | Listas longas paginadas, com no máximo 100 itens |
| RNF14 Uso offline | `PUT /ciclo/registros/{data}` pode ser repetido sem duplicar |
| RNF16 Manutenibilidade | Conteúdos, UBSs e textos de alerta mudam pelas rotas `/admin`, sem nova versão do app |
| RNF17 Idempotência | Regras da seção 4 |
| RNF18 Versão da API | Prefixo `/api/v1` |

## 8. Ambiente local e simulador

O piloto roda inteiro na máquina de quem desenvolve, com contas e remetentes fictícios (T).

| Item | Valor |
| --- | --- |
| API | `http://127.0.0.1:8080`, com os perfis `dev,piloto` |
| Java | 21 |
| Banco | PostgreSQL 17 pelo Docker Compose, banco `saude_feminina`, porta 5432 |
| Contas fictícias | Conta A e Conta B, que só existem no perfil `piloto` |
| Remetentes do simulador | `simulador-001` ligado à Conta A, `simulador-002` ligado à Conta B e `simulador-003` sem vínculo |
| Token do canal | Em variável de ambiente, fora do Git |

Os dados fictícios entram por uma carga própria do perfil `piloto`, e não por uma migração comum do Flyway, para nunca chegarem a outro ambiente. O Spring Boot escuta em todas as interfaces por padrão; para atender só em `127.0.0.1`, é preciso definir `server.address`.

Cenário de aceite, que junta o guia do chatbot e o teste pedido pelo time:

1. `simulador-001` envia `demo-001` como `HUMOR` com `bem`: `201`.
2. `simulador-001` envia `demo-002` como `QUEIXA` com um relato fictício: `201`.
3. A Conta A consulta `GET /diario/historico`: duas entradas, com data, tipo e origem.
4. `simulador-001` reenvia `demo-002`: `200` com `duplicado: true`. O histórico continua com duas entradas.
5. `simulador-002` envia `demo-001`: `201`. A entrada vai para a Conta B, porque o remetente é outro.
6. `simulador-003` envia qualquer mensagem: `403`. Nada é gravado.
7. A Conta B consulta o histórico: só a entrada dela.
8. Com o banco parado, o envio responde `503` e o bot não confirma o registro.

## 9. Pontos em aberto da API

Onze decisões ficam com o grupo; as quatro primeiras travam a fase Agora.

- [ ] Aprovar o contrato desta aba (rotas, JSON e erros) antes de implementar.
- [ ] Confirmar o fluxo do código de vínculo e quando o bot passa a aceitar `tipo: VINCULO`.
- [ ] Escolher como carregar os dados fictícios do perfil `piloto`. Proposta: uma pasta extra de scripts do Flyway, ligada só nesse perfil.
- [ ] Definir onde guardar a duração média do ciclo informada no cadastro (RF02, RN10). O MER não tem esse atributo.
- [ ] Confirmar a validade do token (60 minutos) e se haverá refresh token depois do piloto.
- [ ] Decidir o módulo dono das tabelas `perfil` e `ubs`. A migração `V2` as criou junto com as de contas, e a aba principal as atribui a personalização e a conteúdo.
- [ ] Definir como o perfil LGBTQIA é ativado: por um campo próprio ou pela identidade de gênero.
- [ ] Fechar as escalas de `humor`, `ansiedade` e `intensidade` do registro do dia.
- [ ] Criar as entidades que faltam para rotas da fase Depois: o aparelho que recebe notificações e o calendário do pré-natal (RF29, RN17).
- [ ] Decidir o módulo dono do login da equipe de saúde (entidade PROFISSIONAL). Proposta: `contas`.
- [ ] Definir limite de tentativas de login e de envios do bot por minuto.
