---
status: aprovado
area: bot
tags:
  - bot
  - produto
  - mvp
---

# Missão do bot e recorte do MVP

Esta nota registra o escopo do piloto do bot aprovado por Arthur. O quadro de execução e auditoria fica em [Missões do bot](missoes-bot.md).

## Missão recomendada

Ser um canal simples de autocuidado conversacional que ajuda a pessoa a registrar humor e queixas para compor o histórico do app.

O melhor encaixe para o piloto do dia 20 é o **check-in guiado ligado ao diário do app**. O README do projeto já descreve o registro de humor e queixas por conversa e a consulta desses registros no histórico do aplicativo. O guia de transferência também define esse fluxo como primeira demonstração.

### Recorte do piloto do dia 20

- O simulador oferece somente **Registrar humor** e **Registrar queixa**.
- Os exemplos usam dados fictícios e respostas simuladas identificadas como demonstração.
- Enquanto o serviço do Histórico está sendo preparado, o simulador não envia nem persiste entradas.
- Autoatendimento, dicas e orientação ficam para uma etapa posterior.

## Missões consideradas

| Missão | Aderência ao projeto atual | O que exige | Recomendação |
| --- | --- | --- | --- |
| Check-in conversacional de bem-estar | Alta: corresponde ao diário e ao histórico descritos no README e no guia do chatbot | Vínculo seguro entre remetente e conta, gravação de humor/queixa e confirmação confiável | Núcleo do piloto |
| Autoatendimento com conteúdo educativo e dicas | Pode complementar o autocuidado depois do piloto | Conteúdo revisado, fontes claras e responsável por manter as informações atualizadas | Etapa posterior |
| Encontrar serviços e explicar como acessá-los (proposta MediLink) | Ainda não confirmada para o produto atual | Recorte geográfico, fontes de serviços, atualização dos dados e jornada de acesso própria | Decidir com o grupo antes de incluir |

A proposta MediLink aparece no [vault do projeto](https://github.com/AntonioWandrey/commit-and-pray-vault) como ideia em avaliação, sem decisão registrada. Ela pode ser uma missão válida para o hackathon, mas muda o foco do bot e ainda não está conectada ao diário descrito neste repositório.

## Jornada proposta

1. O bot apresenta as duas opções do piloto: **Registrar humor** e **Registrar queixa**.
2. Para humor, a pessoa escolhe uma opção guiada, como `bem`, `normal`, `cansada` ou `desconfortavel`.
3. Para queixa, a pessoa escolhe um exemplo fictício predefinido. O fluxo futuro envia o conteúdo correspondente no campo `relato`.
4. Enquanto o serviço não está integrado, o simulador mostra uma resposta marcada como simulada e não afirma que o Histórico foi atualizado.
5. Na integração futura, o bot só confirma um registro depois de o serviço salvá-lo. O app mostra a entrada no histórico da conta correspondente.

## Limites para a primeira versão

- Não diagnosticar, prescrever tratamento nem recomendar medicamentos.
- Não classificar automaticamente a gravidade de sintomas.
- Não gerar dicas de saúde livremente com um modelo. Usar conteúdo aprovado e versionado pela equipe.
- Não repetir o relato da pessoa na confirmação e não gravar mensagens ou relatos em logs.
- Não misturar registros entre contas. O servidor valida o vínculo do remetente e a conta; um remetente sem vínculo não cria registro.
- Evitar integração real com WhatsApp enquanto não houver ambiente de teste. O guia sugere começar com um simulador local conectado ao serviço de registros.

## Critérios da próxima integração com o Histórico

Estes critérios pertencem à etapa que virá depois do simulador local; ainda não são comportamento deste piloto.

- Uma conversa de demonstração registra um humor e uma queixa sintéticos, e ambos aparecem no histórico da conta vinculada.
- Reenviar a mesma mensagem não duplica a entrada.
- Um remetente sem vínculo recebe orientação e não cria registro.
- Uma segunda conta só consulta os próprios registros.
- Uma falha ao salvar não produz confirmação de sucesso.
- Autoatendimento e dicas não fazem parte dos critérios do piloto; quando entrarem no escopo, devem usar conteúdo aprovado, fonte e data de revisão.

Os quatro primeiros cenários de registro seguem o [guia de transferência e chatbot](transplante-e-chatbot.md). Eles são critérios propostos para implementação, não evidência de que esses serviços já existam no código.

## Dependências antes de conectar o bot

- Iniciar a integração somente depois que o serviço do Histórico e seu contrato estiverem disponíveis e confirmados.
- Se autoatendimento e dicas entrarem em uma etapa futura, definir quem revisa o conteúdo e quais fontes serão aceitas.
- Implementar o serviço de registros por conta e o vínculo entre remetente e conta antes de integrar o canal.
- Resolver a configuração de banco e migrações descrita de forma divergente no README e na configuração atual do backend.
- Manter o simulador local como primeiro canal de demonstração; integrar WhatsApp depois de validar o fluxo.

## Referências do repositório

- [README](../README.md) — produto e demonstração prevista.
- [Guia de transferência e chatbot](transplante-e-chatbot.md) — cenário, contrato proposto e ordem de implementação.
- [Vault do projeto](https://github.com/AntonioWandrey/commit-and-pray-vault) — propostas e estado do alinhamento do grupo.
