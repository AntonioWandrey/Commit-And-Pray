---
projeto: CommitAndPray
atualizado: 2026-11-15
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
| M2 | Conectar o simulador ao serviço do Histórico | Aguardando | Arthur e Pietro estão preparando o serviço e o contrato |
| M3 | Validar o fluxo integrado e preparar a demonstração | Aguardando | Depende de M2 aprovada; usar dados sintéticos |
| M4 | Adaptador para WhatsApp | Fora do piloto | Exige ambiente de teste e nova aprovação |
| M5 | Autoatendimento, dicas e orientação | Fora do piloto | Exige conteúdo revisado e nova aprovação |

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

## M2 — Conectar ao serviço do Histórico

**Objetivo:** trocar a prévia local pela chamada ao serviço que Arthur e Pietro estão preparando.

**Estado:** Aguardando. Não iniciar a sessão de codificação até o serviço e o contrato estarem disponíveis e confirmados.

**Entrada obrigatória para abrir a sessão:** rota e método, formato de requisição e resposta, autenticação ou vínculo de remetente, erros esperados e ambiente local de teste. O Codex deve usar esses valores fornecidos; não deve adivinhar nenhum deles.

**Critérios de aceite:**

- O simulador envia humor e queixa ao serviço acordado, usando o contrato aprovado.
- O servidor resolve remetente e conta; o simulador não escolhe livremente a conta de destino.
- A confirmação de sucesso ocorre somente após o serviço confirmar a gravação.
- Falha do serviço não aparece como registro concluído; a interface informa que a tentativa falhou.
- Reenvio da mesma mensagem não duplica a entrada, conforme a idempotência implementada pelo serviço.
- A missão não altera o schema ou o serviço do Histórico sem uma tarefa separada.

## M3 — Validar o fluxo integrado e preparar a demonstração

**Objetivo:** conferir o percurso do simulador até o Histórico com dados inteiramente sintéticos.

**Estado:** Aguardando M2 aprovada.

**Critérios de aceite:**

- Registrar um humor e uma queixa e ver as duas entradas na conta fictícia do Histórico, com data, tipo e origem.
- Reenviar uma mensagem e conferir que não há duplicata.
- Tentar um remetente sem vínculo e conferir que nenhuma entrada é gravada.
- Conferir que uma segunda conta fictícia só consulta os próprios registros.
- Simular indisponibilidade do serviço e conferir que o bot não acusa sucesso.
- Registrar instruções reproduzíveis para a demonstração do piloto.

## M4 — Adaptador para WhatsApp (fora do piloto)

Não iniciar até o simulador integrado estar aprovado, existir ambiente de teste do canal e Arthur aprovar esta missão. Quando aberta, limitar o trabalho ao transporte de mensagens entre WhatsApp e o mesmo serviço do Histórico; preservar identificador de mensagem, remetente, horário com fuso e idempotência.

## M5 — Autoatendimento, dicas e orientação (fora do piloto)

Não iniciar até Arthur aprovar o escopo e a equipe fornecer conteúdo e fontes revisados. Uma missão futura deve definir tópicos, responsável por revisão, fonte e data de atualização, fallback para informação ausente e limites de segurança. Não incluir diagnóstico, prescrição ou classificação de urgência sem uma decisão e validação separadas.

## Histórico de decisões e auditorias

| Data | Missão | Decisão | Evidência ou motivo | Revisado por |
| --- | --- | --- | --- | --- |
| 2026-11-15 | Escopo do bot | Aprovado | Duas ações no piloto; exemplos fictícios; respostas simuladas até o serviço do Histórico estar pronto; autoatendimento e orientação ficam para depois. | Arthur |
| 2026-11-15 | M1 — Simulador local | Em revisão | PR #8 aberta; aguarda auditoria dos critérios M1. | — |
