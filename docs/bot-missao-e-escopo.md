---
status: proposta
area: bot
tags:
  - bot
  - produto
  - mvp
---

# Missão do bot e recorte do MVP

Esta nota propõe uma missão inicial para orientar o trabalho do bot. A escolha final de produto ainda depende do alinhamento do grupo.

## Missão recomendada

Ser um canal simples de autocuidado conversacional que ajuda a pessoa a registrar como está se sentindo e a encontrar conteúdo educativo revisado sobre saúde feminina. O bot deve confirmar os registros depois de salvá-los e apresentar dicas curtas com fonte e data de revisão.

O melhor encaixe para a primeira entrega é o **check-in guiado ligado ao diário do app**. O README do projeto já descreve o registro de humor e queixas por conversa e a consulta desses registros no histórico do aplicativo. O guia de transferência também define esse fluxo como primeira demonstração. As dicas entram como um complemento pequeno, com conteúdo previamente revisado.

## Missões consideradas

| Missão | Aderência ao projeto atual | O que exige | Recomendação |
| --- | --- | --- | --- |
| Check-in conversacional de bem-estar | Alta: corresponde ao diário e ao histórico descritos no README e no guia do chatbot | Vínculo seguro entre remetente e conta, gravação de humor/queixa e confirmação confiável | Núcleo do MVP |
| Autoatendimento com conteúdo educativo e dicas | Média/alta como complemento ao autocuidado | Conteúdo revisado, fontes claras e responsável por manter as informações atualizadas | Começar com poucos tópicos e opções guiadas |
| Encontrar serviços e explicar como acessá-los (proposta MediLink) | Ainda não confirmada para o produto atual | Recorte geográfico, fontes de serviços, atualização dos dados e jornada de acesso própria | Decidir com o grupo antes de incluir |

A proposta MediLink aparece no [vault do projeto](https://github.com/AntonioWandrey/commit-and-pray-vault) como ideia em avaliação, sem decisão registrada. Ela pode ser uma missão válida para o hackathon, mas muda o foco do bot e ainda não está conectada ao diário descrito neste repositório.

## Jornada proposta

1. O bot apresenta opções claras: **Registrar humor**, **Registrar queixa** e **Ver dicas de autocuidado**.
2. Para humor, a pessoa escolhe uma opção guiada, como `bem`, `normal`, `cansada` ou `desconfortavel`.
3. Para queixa, a pessoa informa um relato. Na demonstração do hackathon, usar somente dados sintéticos.
4. Para dicas, a pessoa escolhe um tópico e recebe um texto curto revisado, com fonte e data de revisão.
5. O bot só confirma um registro depois de o serviço salvá-lo. O app mostra a entrada no histórico da conta correspondente.
6. Se a pessoa pedir algo fora do conteúdo disponível, o bot explica o limite e orienta a procurar um canal de atendimento apropriado, sem inventar uma resposta.

## Limites para a primeira versão

- Não diagnosticar, prescrever tratamento nem recomendar medicamentos.
- Não classificar automaticamente a gravidade de sintomas.
- Não gerar dicas de saúde livremente com um modelo. Usar conteúdo aprovado e versionado pela equipe.
- Não repetir o relato da pessoa na confirmação e não gravar mensagens ou relatos em logs.
- Não misturar registros entre contas. O servidor valida o vínculo do remetente e a conta; um remetente sem vínculo não cria registro.
- Evitar integração real com WhatsApp enquanto não houver ambiente de teste. O guia sugere começar com um simulador local conectado ao serviço de registros.

## Critérios de aceite do fluxo de registro

- Uma conversa de demonstração registra um humor e uma queixa sintéticos, e ambos aparecem no histórico da conta vinculada.
- Reenviar a mesma mensagem não duplica a entrada.
- Um remetente sem vínculo recebe orientação e não cria registro.
- Uma segunda conta só consulta os próprios registros.
- Uma falha ao salvar não produz confirmação de sucesso.
- Uma dica apresenta conteúdo aprovado, fonte e data de revisão.

Os quatro primeiros cenários de registro seguem o [guia de transferência e chatbot](transplante-e-chatbot.md). Eles são critérios propostos para implementação, não evidência de que esses serviços já existam no código.

## Dependências antes de conectar o bot

- Confirmar com o grupo se a missão principal é o diário de bem-estar ou o autoatendimento MediLink.
- Definir quem revisa as dicas e quais fontes serão aceitas.
- Implementar o serviço de registros por conta e o vínculo entre remetente e conta antes de integrar o canal.
- Resolver a configuração de banco e migrações descrita de forma divergente no README e na configuração atual do backend.
- Manter o simulador local como primeiro canal de demonstração; integrar WhatsApp depois de validar o fluxo.

## Referências do repositório

- [README](../README.md) — produto e demonstração prevista.
- [Guia de transferência e chatbot](transplante-e-chatbot.md) — cenário, contrato proposto e ordem de implementação.
- [Vault do projeto](https://github.com/AntonioWandrey/commit-and-pray-vault) — propostas e estado do alinhamento do grupo.
