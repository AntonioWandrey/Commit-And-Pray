# Transferência do Cuidado Feminino e início do chatbot

O primeiro fluxo de demonstração é uma conversa com uma conta fictícia. A pessoa informa como está se sentindo, registra uma queixa e vê as duas entradas no app. Cada entrada mostra data, tipo e origem. A conversa pode começar num simulador local ligado ao mesmo serviço de registros que o futuro adaptador do WhatsApp usará.

## O que a base oferece

A origem é o arquivo `cuidado-feminino-fullstack-main.zip`, do repositório `AntonioWandrey/cuidado-feminino-fullstack` no commit `c285c2ef06a8b6d2d14ba575473e5141a3b97889`. A [API transferida](../backend/cuidado-feminino-api) mantém o backend Java 21 com Spring Boot e MySQL, o Maven Wrapper, as migrações `V1` e `V2`, o registro de saúde e o módulo de ciclos. Veja os [passos de execução local](../README.md#rodar-a-api-localmente) para preparar um schema novo.

| Parte da base | Uso no MVP |
| --- | --- |
| Infraestrutura da API e migrações | Servem de ponto de partida. O histórico por conta entra em uma nova migração. |
| Registro de saúde legado | Referência para entender o formulário antigo. O modelo e a consulta são globais, sem vínculo com conta ou remetente. O formulário web ainda colocava humor em `faseVida` e enviava apenas parte dos campos selecionados. |
| Módulo de ciclos | Fica disponível na base. A integração dele com o app pode esperar até a jornada de conversa e histórico funcionar. |
| Interface web antiga | A transferência abrange o backend. No React Native, recrie o fluxo de check-in, as opções de humor e os padrões visuais úteis. O calendário e o perfil da web mantinham estado em memória. O conteúdo das trilhas era estático. |

O bot precisa gravar num histórico associado à conta para entregar cada mensagem à pessoa certa. Escrever no registro legado misturaria entradas de pessoas diferentes e deixaria sem resposta a pergunta central da demo, que é de quem é cada registro. A interface de histórico deve consultar os registros da conta identificada pelo servidor.

## Validação da base importada

O Maven 3.9.12 compilou e empacotou a API com JDK 21 em `mvn verify`. O teste de contexto passou em um schema MySQL vazio. O Flyway aplicou V1 e V2 automaticamente, e o Hibernate validou a estrutura. Em outro schema vazio, o JAR iniciou, gravou um registro fictício e o devolveu após reiniciar. V1 e V2 apareceram uma única vez no histórico de migrações. O MySQL 9.6 usado no ensaio gerou um aviso de versão acima da faixa verificada pelo Flyway.

## Primeiro passo para o Arthur

Monte um simulador de conversa local com uma conta fictícia, um identificador fictício de remetente e duas ações guiadas, `Registrar humor` e `Registrar queixa`. Comece com uma interface simples ou um script local que gere as entradas abaixo. Enquanto o serviço de registros estiver em construção, use uma resposta simulada identificada no ambiente de desenvolvimento. Depois conecte o simulador ao mesmo serviço que atenderá o canal real.

### Contrato proposto

- A entrada do adaptador contém `mensagemId`, `remetenteRef`, `recebidaEm` e `tipo`. Use um identificador estável para a mensagem, um identificador de teste para o remetente e data e hora com fuso.
- Para `HUMOR`, envie `humor` com uma opção guiada como `bem`, `normal`, `cansada` ou `desconfortavel`. Para `QUEIXA`, envie `relato` com texto fictício. Valide o campo correspondente ao tipo antes de gravar.
- O servidor resolve o vínculo entre o remetente e a conta de demonstração. O canal de origem é definido pelo adaptador. Um remetente sem vínculo recebe uma resposta de orientação e a mensagem não entra no histórico.
- O serviço grava um registro com conta, tipo, conteúdo, data e origem. A combinação de canal e identificador da mensagem deve ter unicidade no banco para que o reenvio devolva a mesma confirmação sem duplicar o histórico.
- A confirmação só sai depois da gravação. Uma falha de persistência produz uma mensagem de erro e permite tentar de novo. A mensagem de resposta evita repetir o relato da pessoa.
- A busca por UBS pode aparecer como opção de informação geral. O MVP deixa para outra etapa a avaliação automatizada de sintomas.

### Cenário de demonstração

1. Envie `demo-001` como `HUMOR` com valor `bem` e `demo-002` como `QUEIXA` com um relato sintético.
2. Abra o histórico da conta vinculada no app e confira as duas entradas com data e origem. Feche e reabra o app para conferir que os registros continuam lá.
3. Reenvie `demo-002` e confira que o histórico ainda tem duas entradas. Tente com um remetente fictício sem vínculo e confira que nenhum registro é criado.
4. Consulte com uma segunda conta fictícia e confira que ela só vê os próprios registros.

## Ordem de implementação

1. Subir a API com um MySQL local vazio e verificar migrações e teste de contexto. Registrar o resultado antes de mudar o modelo.
2. Adicionar uma migração para conta de demonstração, vínculo com canal e registros de bem-estar. Implementar gravação idempotente e consulta do histórico por conta no backend.
3. Conectar o simulador do Arthur ao serviço e implementar a tela de Histórico no app React Native. Validar o cenário completo com dados sintéticos.
4. Integrar o WhatsApp quando houver ambiente de teste. Validar a origem dos eventos, tratar reenvios e rodar o mesmo cenário. Manter o simulador identificado para a apresentação se a integração real ainda estiver pendente.
