---
projeto: CommitAndPray
atualizado: 2026-11-16
status: em-andamento
area: bot
tags:
  - bot
  - missoes
  - auditoria
---

# Missões do bot

Este é o quadro de acompanhamento do trabalho do bot. Cada missão deve ter sua própria sessão do Codex e não pode ampliar o escopo sem uma decisão explícita de Arthur.

## Escopo aprovado

O bot é a entrada conversacional do diário de bem-estar do app.

**No piloto do dia 20:**

- Oferece somente **Registrar humor** e **Registrar queixa**.
- Usa as opções de humor do guia e exemplos de queixas fictícios.
- Enquanto o serviço do Histórico não estiver disponível, roda no simulador local, mostra respostas simuladas e não envia nem persiste entradas.
- Depois da integração, usa o serviço compartilhado com o app e só confirma um registro quando o serviço confirmar a gravação.

**Fora do piloto:** autoatendimento, dicas e orientação de saúde, busca de serviços, integração com WhatsApp, diagnóstico, prescrição e classificação de urgência. Essas ideias não entram em uma missão ativa sem nova aprovação.

Referências: [escopo aprovado](bot-missao-e-escopo.md), [guia do chatbot](transplante-e-chatbot.md) e [simulador local](../tools/simulador-bot/README.md).

## Regras para toda sessão de missão

1. Trabalhar somente na missão indicada e nos critérios escritos nesta nota.
2. Não adicionar funcionalidade, dependência, integração ou refatoração fora do pedido.
3. Não inventar endpoint, schema, conteúdo clínico, credencial ou regra de negócio. Se uma dependência faltar, parar nesse limite e reportar o bloqueio.
4. Usar apenas dados fictícios e não gravar relatos de saúde em logs.
5. Distinguir resposta simulada de entrada persistida. Não dizer que salvou no Histórico sem confirmação do serviço.
6. Ao terminar, entregar o relatório padrão abaixo. A missão só muda para **Aprovada** depois da auditoria de Arthur e do assistente.

### Relatório obrigatório da sessão

```text
Missão:
Resultado: concluída / parcial / bloqueada
O que foi feito:
Arquivos alterados:
Critérios de aceite: aprovado/reprovado para cada critério, com evidência
Verificações executadas e resultado:
Pendências ou dependências:
Mudanças fora do escopo: nenhuma / listar
Recomendação: APROVADO / REPROVADO
```

## Quadro de andamento

| ID | Missão | Estado | Dependência ou referência |
| --- | --- | --- | --- |
| M1 | Simulador local de humor e queixa | Em revisão | [PR #8](https://github.com/AntonioWandrey/Commit-And-Pray/pull/8) |
| M2 | Núcleo conversacional desacoplado | Em revisão | Implementação desta sessão; módulo sem DOM e adaptador simulado, aguardando auditoria |
| M3 | Integrar o simulador ao serviço do Histórico | Aguardando | Depende de serviço e contrato confirmados; a integração foi movida para esta missão |
| M4 | Validar o fluxo integrado e preparar a demonstração | Aguardando | Depende de M3 aprovada; usar dados sintéticos |
| M5 | Adaptador para WhatsApp | Fora do piloto | Exige ambiente de teste e nova aprovação |
| M6 | Autoatendimento, dicas e orientação | Fora do piloto | Exige conteúdo revisado e nova aprovação |

Estados permitidos: **Aguardando**, **Em andamento**, **Em revisão**, **Aprovada**, **Reprovada**, **Bloqueada** e **Fora do piloto**. Ao mudar um estado, registrar a evidência e a decisão da revisão na tabela de histórico no fim desta nota.

## M1 — Simulador local de humor e queixa

**Objetivo:** permitir demonstrar as duas ações do bot em um navegador sem depender do backend.

**Estado:** Em revisão na PR #8. O escopo desta missão está fechado; a auditoria deve comparar a implementação com os critérios abaixo.

**Critérios de aceite:**

- Abre localmente em `tools/simulador-bot/` sem servidor, credenciais ou dependências externas.
- Apresenta somente as ações principais **Registrar humor** e **Registrar queixa**.
- Humor oferece `bem`, `normal`, `cansada` e `desconfortavel`.
- Queixa usa exemplos fictícios predefinidos; não solicita relato real.
- A prévia usa `mensagemId`, `remetenteRef`, `recebidaEm` com fuso, `tipo` e o campo correspondente (`humor` ou `relato`).
- Conta e remetente são identificadores fictícios.
- A resposta explica que é uma simulação; não há chamada de rede nem persistência em Histórico ou armazenamento local.
- A interface permite reiniciar a conversa e tem instruções de uso.

**Fora desta missão:** conectar o backend, gravar Histórico, aceitar dados reais, criar dicas ou adicionar outras opções.

## M2 — Núcleo conversacional desacoplado

**Objetivo:** separar a lógica conversacional da interface e manter uma resposta simulada que possa ser substituída pela integração com o Histórico.

**Estado:** Em revisão nesta branch. A aprovação depende da auditoria dos critérios abaixo.

**Critérios de aceite:**

- A lógica de conversa, validação e montagem do evento fica em um módulo JavaScript independente do DOM; a interface chama esse módulo.
- A interface mantém somente **Registrar humor** e **Registrar queixa**, com as opções de humor e os exemplos fictícios já existentes no simulador.
- A validação aceita somente os valores guiados de humor e os exemplos fictícios de queixa; o campo do evento corresponde ao tipo (`humor` ou `relato`).
- O evento contém `mensagemId`, `remetenteRef`, `recebidaEm` com data, hora e fuso, `tipo` e somente o campo de conteúdo correspondente.
- O adaptador usado pela interface identifica a resposta como simulada e `persisted: false`; não faz chamadas de rede nem grava em armazenamento.
- O simulador continua abrindo pelo `index.html` local, sem servidor nem dependências novas, e permite reiniciar a conversa.

**Fora desta missão:** integrar API ou banco, persistir dados, definir rota, autenticação ou schema, alterar o serviço que Arthur e Pietro estão preparando, conectar WhatsApp ou adicionar novas opções conversacionais.

## M3 — Integrar o simulador ao serviço do Histórico

**Objetivo:** substituir o adaptador simulado pela integração acordada com o serviço do Histórico, sem alterar o núcleo conversacional nem inventar contrato.

**Estado:** Aguardando. Iniciar somente quando o serviço e seu contrato estiverem disponíveis e confirmados.

**Dependência registrada:** [PR #7](https://github.com/AntonioWandrey/Commit-And-Pray/pull/7) prepara a migração inicial de contas (`ubs`, `perfil`, `usuario` e `usuario_perfil`) e documentação de requisitos, mas o quadro ainda registra como pendentes o serviço do Histórico, as entradas de humor/queixa e o vínculo entre remetente de canal e usuário. A sessão de M3 deve confirmar o estado antes de iniciar.

**Entrada obrigatória para abrir a sessão:**

- A PR ou branch que contém o serviço e qual branch será a base do trabalho do bot (`dev` ou `main`).
- A forma de integração escolhida para o simulador e a API; se for HTTP, informar rota, método e origem local.
- Formato de requisição e resposta, autenticação ou vínculo de remetente, respostas de erro e ambiente local de teste.
- Comportamento acordado para reenvio/idempotência e para remetente sem vínculo.

Use somente os valores fornecidos. Se algum estiver faltando, pare nesse limite e reporte o bloqueio.

**Critérios de aceite:**

- O simulador envia humor e queixa ao serviço acordado, usando o contrato aprovado.
- O servidor resolve remetente e conta; o simulador não escolhe livremente a conta de destino.
- A confirmação de sucesso ocorre somente após o serviço confirmar a gravação.
- Falha do serviço não aparece como registro concluído; a interface informa que a tentativa falhou.
- Reenvio da mesma mensagem não duplica a entrada, conforme a idempotência implementada pelo serviço.
- A missão não altera o schema ou o serviço do Histórico sem uma tarefa separada.

## M4 — Validar o fluxo integrado e preparar a demonstração

**Objetivo:** conferir o percurso do simulador até o Histórico com dados inteiramente sintéticos.

**Estado:** Aguardando M3 aprovada.

**Critérios de aceite:**

- Registrar um humor e uma queixa e ver as duas entradas na conta fictícia do Histórico, com data, tipo e origem.
- Reenviar uma mensagem e conferir que não há duplicata.
- Tentar um remetente sem vínculo e conferir que nenhuma entrada é gravada.
- Conferir que uma segunda conta fictícia só consulta os próprios registros.
- Simular indisponibilidade do serviço e conferir que o bot não acusa sucesso.
- Registrar instruções reproduzíveis para a demonstração do piloto.

## M5 — Adaptador para WhatsApp (fora do piloto)

Não iniciar até o simulador integrado estar aprovado, existir ambiente de teste do canal e Arthur aprovar esta missão. Quando aberta, limitar o trabalho ao transporte de mensagens entre WhatsApp e o mesmo serviço do Histórico; preservar identificador de mensagem, remetente, horário com fuso e idempotência.

## M6 — Autoatendimento, dicas e orientação (fora do piloto)

Não iniciar até Arthur aprovar o escopo e a equipe fornecer conteúdo e fontes revisados. Uma missão futura deve definir tópicos, responsável por revisão, fonte e data de atualização, fallback para informação ausente e limites de segurança. Não incluir diagnóstico, prescrição ou classificação de urgência sem uma decisão e validação separadas.

## Histórico de decisões e auditorias

| Data | Missão | Decisão | Evidência ou motivo | Revisado por |
| --- | --- | --- | --- | --- |
| 2026-11-15 | Escopo do bot | Aprovado | Duas ações no piloto; exemplos fictícios; respostas simuladas até o serviço do Histórico estar pronto; autoatendimento e orientação ficam para depois. | Arthur |
| 2026-11-15 | M1 — Simulador local | Em revisão | PR #8 aberta; aguarda auditoria dos critérios M1. | — |
| 2026-11-16 | M2 — Núcleo conversacional | Em revisão | Módulo conversacional independente do DOM e adaptador simulado adicionados ao simulador; critérios M2 registrados nesta sessão. | — |
