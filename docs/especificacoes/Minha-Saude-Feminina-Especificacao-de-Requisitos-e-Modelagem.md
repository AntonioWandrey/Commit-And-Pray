# Minha Saúde Feminina — Especificação de Requisitos e Modelagem

Nov 12, 2026 · @Pietro

## 1. Visão geral

O Minha Saúde Feminina é um aplicativo gratuito que informa, orienta e acompanha a saúde da mulher em cada fase da vida, sem substituir o atendimento na UBS. Esta especificação deriva dos dois documentos do projeto e marca como **Derivado** tudo o que foi inferido para tornar o sistema viável.

### Fontes

| Sigla | Documento | O que traz |
| --- | --- | --- |
| A | Apresentação "Minha Saúde Feminina" (7 slides) | Proposta, problema encontrado, fases da vida atendidas, vínculo com a UBS |
| E | "Estrutura geral do aplicativo", Projeto de Intervenção, 4ª fase, 2025.2 (9 páginas) | Cadastro inteligente, painéis por perfil, conteúdos e ferramentas |

A coluna **Origem** das tabelas usa a sigla e o slide ou página, por exemplo "E p.3" ou "A s.2". Prioridades: **Essencial** (sem ele o app não cumpre a proposta), **Importante** (primeira evolução) e **Desejável**.

### Atores

| Ator | Tipo | Papel | Origem |
| --- | --- | --- | --- |
| Usuária | Primário | Pessoa atendida pelo app: cadastra-se, registra dados de saúde, consulta conteúdos e recebe lembretes | A s.2, E p.1 |
| Equipe de saúde (curadoria) | Secundário | Publica e revisa conteúdos e responde às perguntas anônimas | Derivado (A s.1: parceria Medicina e S.I.) |
| Tempo (agendador) | Sistema | Dispara lembretes, alertas e notificações semanais nas datas previstas | E p.3, p.4 |
| Sistema de agendamento da UBS | Externo | Recebe a usuária pelo link de agendamento; não troca dados com o app | E p.3 |

### Perfis de usuária

Uma usuária tem um perfil etário e pode acumular situações e condições; a combinação define os painéis liberados.

| Perfil | Tipo | Critério | Origem |
| --- | --- | --- | --- |
| Adolescente | Etário | 10 a 19 anos | E p.2 |
| Mulher adulta | Etário | 20 a 59 anos | E p.2 |
| Idosa | Etário | 60 anos ou mais | E p.5 |
| Gestante | Situação | Declarada no cadastro | E p.4 |
| Puerpério | Situação | Até 6 meses após o parto | E p.5 |
| Tentante | Situação | Tentando engravidar | E p.7 |
| Evitando gravidez | Situação | Deseja evitar gravidez, com ou sem método em uso | E p.3 |
| Doença ginecológica prévia | Condição | Endometriose, SOP, mioma, adenomiose, menopausa precoce | E p.8 |
| Vivendo com HIV | Condição | Declarada pela usuária | E p.8 |
| LGBTQIA+ | Identidade | Lésbicas, bissexuais, transmasculinos e não binários com útero | E p.6 |

## 2. Requisitos funcionais

São 47 requisitos funcionais em 7 módulos; 43 vêm direto dos documentos e 4 são derivados. As prioridades são uma proposta inicial para validação com a equipe.

### Módulo 1: Cadastro, acesso e perfil

| ID | O sistema deve | Prioridade | Origem |
| --- | --- | --- | --- |
| RF01 | Cadastrar a usuária com nome e data de nascimento, calculando a idade | Essencial | E p.1 |
| RF02 | Registrar no cadastro a data da última menstruação e a duração média do ciclo | Essencial | E p.1 |
| RF03 | Permitir selecionar a situação atual: gestante, puerpério, tentando engravidar, desejando evitar gravidez, menstruando regularmente ou com amenorreia, em uso de método contraceptivo (qual) | Essencial | E p.1 |
| RF04 | Registrar identidade de gênero e nome social | Importante | E p.6 |
| RF05 | Liberar seções, painéis e conteúdos personalizados conforme as respostas do cadastro | Essencial | E p.1 |
| RF06 | Permitir atualizar a situação a qualquer momento e recalcular os painéis liberados | Essencial | Derivado (A s.5) |
| RF07 | Proteger o acesso com senha e oferecer modo confidencial | Essencial | E p.6 |
| RF08 | Oferecer visual neutro, que desativa palavras como "mulher" | Importante | E p.6 |
| RF09 | Registrar condições de saúde (endometriose, SOP, mioma, adenomiose, menopausa precoce, HIV) para ativar os painéis específicos | Importante | E p.8 |

### Módulo 2: Conteúdo educativo

| ID | O sistema deve | Prioridade | Origem |
| --- | --- | --- | --- |
| RF10 | Exibir os conteúdos de cada painel conforme os perfis ativos da usuária | Essencial | E p.2 a p.9 |
| RF11 | Apresentar conteúdos em texto, imagem e animação (ex.: ciclo menstrual animado) | Importante | E p.2 |
| RF12 | Oferecer guia de sintomas ginecológicos (corrimentos, coceira, dor pélvica, dor na relação, mamas) com condutas | Essencial | E p.3 |
| RF13 | Destacar sinais de alerta da gestação: febre, sangramento, dor abdominal, corrimento verde | Essencial | E p.4 |
| RF14 | Exibir comparativo de métodos contraceptivos com eficácia, efeitos colaterais e mitos | Importante | E p.3 |
| RF15 | Permitir buscar conteúdos por tema ou palavra-chave | Desejável | Derivado |
| RF16 | Permitir à equipe de saúde cadastrar, revisar e publicar conteúdos, associando cada um aos perfis | Essencial | Derivado (A s.1) |

### Módulo 3: Ciclo menstrual e sintomas

| ID | O sistema deve | Prioridade | Origem |
| --- | --- | --- | --- |
| RF17 | Manter calendário menstrual com registro de menstruação, TPM, sintomas, escape e corrimento | Essencial | E p.2, p.3 |
| RF18 | Analisar automaticamente o padrão do ciclo (duração média, regularidade, próxima menstruação) | Essencial | E p.3 |
| RF19 | Alertar sobre irregularidades persistentes do ciclo | Importante | E p.3, p.8 |
| RF20 | Manter diário de sintomas (dor, fluxo, escape, relação sexual) para doenças ginecológicas | Importante | E p.8 |
| RF21 | Registrar sintomas da menopausa | Importante | E p.6 |

### Módulo 4: Planejamento reprodutivo

| ID | O sistema deve | Prioridade | Origem |
| --- | --- | --- | --- |
| RF22 | Calcular e exibir a janela fértil personalizada | Essencial | E p.3, p.7 |
| RF23 | Registrar tentativas, sintomas ovulatórios e relações sexuais, exibindo o mapa de ovulação | Importante | E p.7 |
| RF24 | Oferecer checklist pré-concepcional (ácido fólico, exames, IMC, parar cigarro, controle de doenças) | Importante | E p.3, p.7 |
| RF25 | Manter diário de humor e ansiedade | Importante | E p.7 |
| RF26 | Aplicar o quiz "Qual o melhor método para mim?" e mostrar o resultado | Importante | E p.3 |
| RF27 | Registrar o método contraceptivo em uso e alertar sobre horário do anticoncepcional, troca do anel, próxima injeção e validade do DIU | Essencial | E p.3 |

### Módulo 5: Gestação e puerpério

| ID | O sistema deve | Prioridade | Origem |
| --- | --- | --- | --- |
| RF28 | Calcular a idade gestacional e a data provável do parto (DPP) | Essencial | E p.4 |
| RF29 | Exibir o calendário de consultas e exames obrigatórios do pré-natal | Essencial | E p.4 |
| RF30 | Registrar movimentos fetais | Importante | E p.4 |
| RF31 | Registrar sintomas da gestação: sangramento, dor, corrimento anormal | Essencial | E p.4 |
| RF32 | Enviar notificações semanais personalizadas pela idade gestacional | Importante | E p.4 |
| RF33 | Lembrar a consulta puerperal | Essencial | E p.5 |
| RF34 | Registrar mamadas | Importante | E p.5 |
| RF35 | Registrar o humor no puerpério para rastreio de depressão pós-parto | Importante | E p.5 |
| RF36 | Oferecer checklists de vacinação da mãe e do bebê | Importante | E p.5 |

### Módulo 6: Lembretes, exames e medicamentos

| ID | O sistema deve | Prioridade | Origem |
| --- | --- | --- | --- |
| RF37 | Permitir criar, editar e concluir lembretes de exames, vacinas e consultas | Essencial | A s.3, E p.2 |
| RF38 | Gerar lembretes automáticos de rastreio e vacinação conforme o perfil (ex.: mamografia anual para 60+) | Importante | E p.3, p.4, p.6 |
| RF39 | Manter calendário de exames regulares para quem vive com HIV: CD4, carga viral, preventivo semestral | Importante | E p.8 |
| RF40 | Controlar o uso de medicamentos, com alertas de horário e registro de efeitos colaterais | Importante | E p.8 |
| RF41 | Controlar datas de exames de imagem e consultas de acompanhamento | Importante | E p.8 |
| RF42 | Aplicar avaliação funcional (escala de fragilidade) para idosas | Desejável | E p.6 |

### Módulo 7: Apoio e vínculo com a UBS

| ID | O sistema deve | Prioridade | Origem |
| --- | --- | --- | --- |
| RF43 | Receber perguntas anônimas pela caixinha de perguntas | Importante | E p.2 |
| RF44 | Oferecer o chat de conteúdo automático "É normal isso?" | Importante | E p.2 |
| RF45 | Exibir link para agendamento na UBS | Essencial | E p.3 |
| RF46 | Listar UBSs acolhedoras com profissionais LGBTQIA+ friendly | Desejável | E p.6 |
| RF47 | Permitir à equipe de saúde moderar e responder às perguntas anônimas | Importante | Derivado (E p.2) |

## 3. Requisitos não funcionais

São 16 requisitos não funcionais; os de privacidade e segurança pesam mais, porque o app guarda dados de saúde íntima. As métricas numéricas são propostas, pois os documentos não as definem.

| ID | Categoria | Requisito | Origem |
| --- | --- | --- | --- |
| RNF01 | Usabilidade | Toda a interface e os conteúdos usam linguagem simples, próxima e acolhedora, sem julgamentos | A s.2, s.3 |
| RNF02 | Usabilidade | O cadastro termina em até 5 minutos e cada ferramenta do painel fica a no máximo 3 toques da tela inicial | A s.2 (métrica proposta) |
| RNF03 | Acessibilidade | Contraste, tamanho de fonte ajustável e compatibilidade com leitor de tela, seguindo a WCAG 2.1 nível AA | A s.2 (padrão proposto) |
| RNF04 | Gratuidade | Nenhuma funcionalidade é paga; o app não tem compras internas | A s.2, s.4 |
| RNF05 | Privacidade | Dados de saúde são tratados como dados pessoais sensíveis pela LGPD: consentimento específico no cadastro, finalidade declarada, exportação e exclusão a pedido | Derivado |
| RNF06 | Segurança | Comunicação por HTTPS (TLS 1.2 ou superior), dados sensíveis cifrados em repouso e senha guardada apenas como hash | Derivado (E p.6) |
| RNF07 | Confidencialidade | No modo confidencial, as notificações não mostram conteúdo sensível e o app exige senha a cada abertura | E p.6 |
| RNF08 | Anonimato | Perguntas anônimas são gravadas sem qualquer identificador da usuária | E p.2 |
| RNF09 | Confiabilidade do conteúdo | Todo conteúdo é revisado por profissional de saúde antes de publicado e mostra a data da última revisão | A s.2, s.4 |
| RNF10 | Inclusão | Linguagem e imagens respeitam a diversidade; o tratamento segue o nome social e o visual neutro quando ativados | A s.2, E p.6 |
| RNF11 | Aviso de saúde | O app informa que não substitui o atendimento e orienta procurar o serviço de saúde em toda tela de sintomas e alertas | A s.6 |
| RNF12 | Compatibilidade | Funciona em Android e iOS, inclusive em aparelhos de entrada | Derivado |
| RNF13 | Desempenho | Telas abrem em até 2 segundos em rede 4G | Derivado |
| RNF14 | Uso offline | Calendário, registros e lembretes funcionam sem internet e sincronizam quando houver conexão | Derivado (A s.2) |
| RNF15 | Disponibilidade | A API fica disponível em 99% do mês | Derivado |
| RNF16 | Manutenibilidade | Conteúdos, calendários de exames e textos de alerta são alterados pela curadoria sem publicar nova versão do app | Derivado |

## 4. Regras de negócio

São 24 regras; as que trazem fórmulas ou limites clínicos estão marcadas como **parâmetro proposto** e precisam de validação da equipe de Medicina antes da implementação.

### Perfis e personalização

| ID | Regra | Origem |
| --- | --- | --- |
| RN01 | O perfil etário vem da data de nascimento: adolescente de 10 a 19 anos, adulta de 20 a 59, idosa a partir de 60 | E p.2, p.5 |
| RN02 | A idade mínima para cadastro é 10 anos | Derivado (E p.2) |
| RN03 | O perfil etário muda sozinho no aniversário que cruza a faixa, e a usuária é avisada dos novos painéis | Derivado (A s.5) |
| RN04 | A usuária tem exatamente um perfil etário e pode acumular situações e condições (ex.: adulta, evitando gravidez, com SOP) | E p.1 |
| RN05 | Gestante, puerpério, tentante e evitando gravidez são situações mutuamente exclusivas | Derivado |
| RN06 | Os painéis e conteúdos liberados são a união dos conteúdos de todos os perfis ativos | E p.1 |
| RN07 | O puerpério dura até 6 meses após o parto; ao fim, o app pede à usuária a nova situação | E p.5 |
| RN08 | Ao registrar a data do parto, a situação passa de gestante para puerpério | Derivado |
| RN09 | Com visual neutro ativo, termos como "mulher" são trocados por formas neutras em toda a interface | E p.6 |

### Ciclo, fertilidade e contracepção

| ID | Regra | Origem |
| --- | --- | --- |
| RN10 | Próxima menstruação = início da última + duração média do ciclo. A média usa os ciclos registrados; sem histórico, vale a duração informada no cadastro | E p.1, p.3 (parâmetro proposto) |
| RN11 | Ovulação estimada = próxima menstruação menos 14 dias; janela fértil = dos 5 dias anteriores até 1 dia depois da ovulação | E p.3, p.7 (parâmetro proposto) |
| RN12 | Há irregularidade persistente quando 3 ciclos seguidos ficam fora de 21 a 35 dias, ou quando não há menstruação por 90 dias sem gestação registrada. O alerta orienta procurar a UBS | E p.3, p.8 (parâmetro proposto) |
| RN13 | O alerta do método contraceptivo segue o método: pílula no horário diário, anel na data de troca, injetável na próxima injeção, DIU na validade | E p.3 |
| RN14 | O resultado do quiz de métodos é orientação, não prescrição, e sempre recomenda consulta | Derivado (A s.6) |
| RN15 | Para tentantes, o app sugere procurar ajuda segundo tempo de tentativa e idade (ex.: 12 meses, ou 6 meses a partir dos 35 anos) | E p.7 (parâmetro proposto) |

### Gestação e puerpério

| ID | Regra | Origem |
| --- | --- | --- |
| RN16 | Idade gestacional = dias desde a data da última menstruação (DUM), em semanas e dias; DPP = DUM + 280 dias | E p.4 (parâmetro proposto) |
| RN17 | As notificações semanais seguem um calendário por semana de gestação mantido pela curadoria (ex.: 28 semanas, vacina da coqueluche) | E p.4 |
| RN18 | Ao registrar um sinal de alerta na gestação (febre, sangramento, dor abdominal, corrimento verde), o app mostra na hora a orientação de procurar atendimento | E p.4 |
| RN19 | Registros de humor negativo persistentes no puerpério geram sugestão de procurar a UBS; o app não diagnostica | E p.5 (limite a definir) |

### Lembretes, conteúdo e privacidade

| ID | Regra | Origem |
| --- | --- | --- |
| RN20 | Lembretes automáticos seguem o perfil: mamografia anual para 60+, preventivo semestral e exames de CD4 e carga viral para quem vive com HIV, vacina de HPV até 45 anos | E p.4, p.6, p.8 |
| RN21 | Um conteúdo só fica visível depois de revisado e publicado por profissional de saúde | Derivado (A s.2) |
| RN22 | O chat "É normal isso?" responde apenas com conteúdo já aprovado, não diagnostica e indica a UBS diante de sinal de alerta | E p.2, A s.6 |
| RN23 | A pergunta anônima é gravada só com o perfil etário de quem perguntou e passa por moderação antes de a resposta ser publicada | E p.2 |
| RN24 | Ao excluir a conta, todos os dados pessoais e de saúde da usuária são apagados | Derivado (RNF05) |

## 5. Casos de uso

São 22 casos de uso: 16 iniciados pela usuária e 6 de apoio, executados pelo sistema, pelo agendador, pela equipe de saúde ou em conjunto com a UBS.

&#91;embedded content: diagrama de casos de uso · 4 atores, 22 casos, 4 inclusões e 1 extensão\]

Os casos à esquerda seguem a ordem UC01 a UC16 da lista abaixo; à direita estão UC17 a UC22. As setas tracejadas mostram o que o cadastro e o registro do ciclo sempre executam e o que o guia de sintomas pode acionar.

### Lista de casos de uso

| ID | Caso de uso | Ator | Requisitos atendidos |
| --- | --- | --- | --- |
| UC01 | Realizar cadastro inteligente | Usuária | RF01 a RF05, RF09 |
| UC02 | Atualizar perfil e situação | Usuária | RF04, RF06, RF08, RF09 |
| UC03 | Autenticar e proteger acesso | Usuária | RF07 |
| UC04 | Consultar conteúdos do painel | Usuária | RF10, RF11, RF14, RF15 |
| UC05 | Registrar ciclo e sintomas | Usuária | RF17, RF20, RF21, RF23, RF25 |
| UC06 | Consultar janela fértil | Usuária | RF22, RF23 |
| UC07 | Responder quiz de métodos | Usuária | RF26 |
| UC08 | Gerenciar método contraceptivo | Usuária | RF27 |
| UC09 | Acompanhar gestação | Usuária | RF28 a RF31 |
| UC10 | Registrar mamadas e humor | Usuária | RF34, RF35 |
| UC11 | Gerenciar lembretes | Usuária | RF37, RF39, RF41 |
| UC12 | Monitorar medicamentos | Usuária | RF40 |
| UC13 | Consultar guia de sintomas | Usuária | RF12, RF13 |
| UC14 | Enviar pergunta anônima | Usuária | RF43 |
| UC15 | Usar chat "É normal isso?" | Usuária | RF44 |
| UC16 | Preencher checklists e escalas | Usuária | RF24, RF36, RF42 |
| UC17 | Desbloquear painéis por perfil | Sistema, incluído em UC01 e UC02 | RF05, RF06 |
| UC18 | Analisar padrão do ciclo | Sistema, incluído em UC05 e UC06 | RF18, RF19, RF22 |
| UC19 | Enviar notificações e alertas | Tempo | RF19, RF27, RF32, RF33, RF38 |
| UC20 | Acessar agendamento na UBS | Usuária e sistema da UBS, estende UC13 | RF45, RF46 |
| UC21 | Gerenciar conteúdos | Equipe de saúde | RF16 |
| UC22 | Responder perguntas anônimas | Equipe de saúde | RF47 |

### UC01: Realizar cadastro inteligente

**Ator:** Usuária. **Pré-condição:** app instalado, sem conta. **Pós-condição:** conta criada, perfis ativos e painéis liberados. **Regras:** RN01, RN02, RN04, RN05, RN06.

Fluxo principal:

1. A usuária abre o app e escolhe criar conta.
2. O sistema apresenta o termo de uso e o consentimento para dados de saúde.
3. A usuária aceita e informa nome, data de nascimento e senha.
4. O sistema calcula a idade e define o perfil etário.
5. A usuária informa, se quiser, nome social e identidade de gênero.
6. A usuária informa a data da última menstruação e a duração média do ciclo.
7. A usuária marca a situação atual e, se usa método contraceptivo, qual.
8. A usuária marca condições de saúde, se houver.
9. O sistema ativa os perfis e libera os painéis (inclui UC17).
10. O sistema mostra a tela inicial personalizada.

Fluxos alternativos:

- 2a. A usuária recusa o consentimento: o sistema encerra sem criar a conta.
- 3a. Idade menor que 10 anos: o sistema informa a idade mínima e encerra (RN02).
- 6a. A usuária não menstrua (amenorreia, gestação, menopausa): o sistema pula os dados do ciclo.
- 7a. Situações incompatíveis marcadas: o sistema pede que escolha uma (RN05).
- 7b. Gestante: o sistema pede a DUM e calcula idade gestacional e DPP (RN16).

### UC05: Registrar ciclo e sintomas

**Ator:** Usuária. **Pré-condição:** usuária autenticada. **Pós-condição:** registro gravado e previsões atualizadas. **Regras:** RN10, RN11, RN12, RN18.

Fluxo principal:

1. A usuária abre o calendário e escolhe um dia.
2. O sistema mostra as opções do dia conforme o perfil: menstruação, fluxo, TPM, escape, corrimento, dor, humor, relação sexual.
3. A usuária marca o que ocorreu e salva.
4. O sistema grava o registro e, se for início de menstruação, abre um novo ciclo.
5. O sistema recalcula duração média, próxima menstruação e janela fértil (inclui UC18).
6. O sistema atualiza o calendário com as previsões.

Fluxos alternativos:

- 3a. Sem internet: o registro fica no aparelho e sincroniza depois (RNF14).
- 3b. Gestante registra sinal de alerta: o sistema mostra a orientação de procurar atendimento (RN18).
- 5a. Irregularidade persistente: o sistema exibe o alerta e o link de agendamento na UBS (RN12).

### UC08: Gerenciar método contraceptivo

**Ator:** Usuária. **Pré-condição:** situação "evitando gravidez" ativa ou método informado no cadastro. **Pós-condição:** método em uso gravado e alertas agendados. **Regras:** RN13.

Fluxo principal:

1. A usuária abre o painel de contracepção e escolhe "meu método".
2. O sistema lista os métodos: pílula, DIU, injetável, anel, preservativo, implante.
3. A usuária escolhe o método e informa a data de início.
4. O sistema pede o dado próprio do método: horário da pílula, data de troca do anel, data da última injeção ou data de inserção do DIU.
5. O sistema calcula a próxima data e cria os lembretes.
6. Na data, o agendador envia o alerta (UC19) e a usuária confirma o uso.

Fluxos alternativos:

- 3a. Troca de método: o sistema encerra o uso anterior e cancela os lembretes dele.
- 6a. Alerta não confirmado: o sistema mostra o conteúdo sobre o que fazer em caso de esquecimento.

### UC09: Acompanhar gestação

**Ator:** Usuária. **Pré-condição:** perfil gestante ativo com DUM informada. **Pós-condição:** registros gravados e calendário do pré-natal atualizado. **Regras:** RN08, RN16, RN17, RN18.

Fluxo principal:

1. A usuária abre o painel da gestação.
2. O sistema mostra a idade gestacional, a DPP e o alerta da semana.
3. O sistema lista as consultas e os exames previstos do pré-natal.
4. A usuária marca consultas e exames realizados ou agenda lembretes.
5. A usuária registra movimentos fetais ou sintomas do dia.
6. O sistema grava os registros e atualiza o painel.

Fluxos alternativos:

- 1a. A usuária informa a data do parto: o sistema encerra a gestação e ativa o puerpério (RN08).
- 5a. O sintoma é sinal de alerta: o sistema mostra na hora a orientação de procurar atendimento (RN18).

### UC14: Enviar pergunta anônima

**Ator:** Usuária. **Pré-condição:** usuária autenticada. **Pós-condição:** pergunta na fila de moderação, sem identificação. **Regras:** RN23, RNF08.

Fluxo principal:

1. A usuária abre a caixinha de perguntas.
2. O sistema informa que a pergunta é anônima e que a resposta não é imediata.
3. A usuária escreve a pergunta e envia.
4. O sistema grava o texto apenas com o perfil etário e confirma o envio.
5. A equipe de saúde responde e publica (UC22).
6. A usuária encontra a resposta na lista de perguntas respondidas do painel.

Fluxos alternativos:

- 3a. O texto indica urgência: o sistema mostra a orientação de procurar atendimento antes de enviar.
- 5a. Pergunta imprópria ou com dados pessoais: a equipe arquiva sem publicar.

### UC19: Enviar notificações e alertas

**Ator:** Tempo (agendador). **Pré-condição:** existem lembretes ativos. **Pós-condição:** notificação entregue e registrada. **Regras:** RN13, RN17, RN20, RNF07.

Fluxo principal:

1. No horário programado, o agendador busca os lembretes vencidos.
2. O sistema gera os lembretes automáticos do perfil: rastreios, vacinas, semana gestacional.
3. O sistema monta a mensagem de cada lembrete.
4. O sistema envia a notificação ao aparelho.
5. A usuária abre a notificação e marca como concluído ou adia.
6. O sistema grava o resultado e programa a próxima ocorrência, se houver recorrência.

Fluxos alternativos:

- 3a. Modo confidencial ativo: a mensagem é genérica, sem conteúdo sensível (RNF07).
- 4a. Aparelho sem internet: o lembrete local do app dispara no horário (RNF14).

## 6. Modelagem do banco (MER)

O modelo tem 25 entidades: USUARIA é o centro, 13 entidades guardam os dados dela e 11 são catálogos e conteúdos mantidos pela equipe de saúde. Nomes sem acento e em maiúsculas já seguem o padrão das tabelas.

&#91;embedded content: modelo entidade-relacionamento · 25 entidades, notação pé de galinha\]

Cada linha liga um lado "um" (traço) a um lado "muitos" (pé de galinha). PERGUNTA\_ANONIMA se liga a PERFIL e a PROFISSIONAL, nunca a USUARIA; várias usuárias podem ter a mesma UBS de referência.

### Dicionário de entidades

| Entidade | Atributos | Descrição |
| --- | --- | --- |
| USUARIA | **id (PK)**, nome, nome\_social, identidade\_genero, data\_nascimento, email, senha\_hash, visual\_neutro, modo\_confidencial, ubs\_id (FK), criado\_em | Pessoa cadastrada no app |
| PERFIL | **id (PK)**, codigo, nome, tipo, idade\_min, idade\_max | Catálogo de perfis: etários, situações, condições e identidade |
| USUARIA\_PERFIL | **id (PK)**, usuaria\_id (FK), perfil\_id (FK), data\_inicio, data\_fim | Perfis ativos e históricos de cada usuária |
| CONTEUDO | **id (PK)**, profissional\_id (FK), titulo, corpo, formato, categoria, publicado, revisado\_em | Material educativo e respostas do chat automático |
| CONTEUDO\_PERFIL | **conteudo\_id (PK, FK)**, **perfil\_id (PK, FK)** | Liga cada conteúdo aos perfis que o enxergam |
| PROFISSIONAL | **id (PK)**, nome, email, senha\_hash, registro\_profissional, papel | Membro da equipe de saúde que cuida da curadoria |
| PERGUNTA\_ANONIMA | **id (PK)**, perfil\_id (FK), profissional\_id (FK), texto, resposta, status, criada\_em, respondida\_em | Pergunta da caixinha; não tem chave para USUARIA |
| CICLO | **id (PK)**, usuaria\_id (FK), data\_inicio, data\_fim, duracao\_dias | Cada ciclo menstrual registrado |
| REGISTRO\_DIARIO | **id (PK)**, usuaria\_id (FK), data, fluxo, humor, ansiedade, relacao\_sexual, observacao | Anotações de um dia no calendário |
| SINTOMA | **id (PK)**, nome, categoria, sinal\_alerta | Catálogo de sintomas: TPM, escape, corrimento, dor, ovulatórios, menopausa |
| REGISTRO\_SINTOMA | **registro\_id (PK, FK)**, **sintoma\_id (PK, FK)**, intensidade | Sintomas marcados em um registro diário |
| METODO | **id (PK)**, nome, tipo, eficacia, intervalo\_dias | Catálogo de métodos contraceptivos |
| USO\_METODO | **id (PK)**, usuaria\_id (FK), metodo\_id (FK), data\_inicio, data\_fim, horario, proxima\_data | Método em uso e dados para os alertas |
| GESTACAO | **id (PK)**, usuaria\_id (FK), dum, dpp, data\_parto, tipo\_parto, status | Gestação e puerpério de uma usuária |
| MOVIMENTO\_FETAL | **id (PK)**, gestacao\_id (FK), data\_hora, quantidade | Contagem de movimentos fetais |
| MAMADA | **id (PK)**, gestacao\_id (FK), inicio, duracao\_min, lado | Mamadas registradas no puerpério |
| MEDICAMENTO | **id (PK)**, usuaria\_id (FK), nome, dose, horario, efeitos\_colaterais, ativo | Medicamento em uso, inclusive antirretrovirais |
| CONDICAO | **id (PK)**, nome, cronica | Catálogo: endometriose, SOP, mioma, adenomiose, menopausa precoce, HIV |
| USUARIA\_CONDICAO | **usuaria\_id (PK, FK)**, **condicao\_id (PK, FK)**, data\_diagnostico, em\_tratamento | Condições de saúde declaradas pela usuária |
| LEMBRETE | **id (PK)**, usuaria\_id (FK), tipo, titulo, data\_hora, recorrencia, automatico, status | Exame, vacina, consulta, medicamento ou método a lembrar |
| NOTIFICACAO | **id (PK)**, lembrete\_id (FK), mensagem, enviada\_em, lida | Cada envio feito a partir de um lembrete |
| QUESTIONARIO | **id (PK)**, tipo, titulo | Quiz de métodos, checklists e escalas de avaliação |
| QUESTAO | **id (PK)**, questionario\_id (FK), enunciado, opcoes, ordem | Item de um questionário |
| PREENCHIMENTO | **id (PK)**, usuaria\_id (FK), questionario\_id (FK), data, respostas, resultado | Um questionário respondido pela usuária |
| UBS | **id (PK)**, nome, endereco, telefone, link\_agendamento, acolhedora\_lgbtqia | Unidades de saúde e seus links de agendamento |

### Decisões de modelagem

- PERGUNTA\_ANONIMA guarda só o perfil etário, sem chave para USUARIA, para garantir o anonimato (RNF08, RN23).
- USUARIA\_PERFIL, CONTEUDO\_PERFIL, REGISTRO\_SINTOMA e USUARIA\_CONDICAO resolvem os relacionamentos N:N.
- LEMBRETE é único para exames, vacinas, consultas, medicamentos e métodos; o campo tipo diferencia e o campo automatico marca os gerados por perfil (RN20).
- GESTACAO cobre também o puerpério: data\_parto preenchida inicia a contagem dos 6 meses (RN07).

## 7. Diagrama de classes

As classes de domínio espelham o MER e acrescentam comportamento: cálculos em Gestacao, UsoMetodo e Lembrete, o serviço AnalisadorCiclo e a hierarquia de Questionario. As tabelas associativas do MER viram associações muitos-para-muitos, exceto Diagnostico, que tem atributos próprios.

&#91;embedded content: diagrama de classes · 25 classes, 1 serviço, 1 hierarquia\]

Questionario é abstrata: Quiz, Checklist e Escala implementam calcularResultado() cada um à sua maneira. PerguntaAnonima não tem associação com Usuaria, só com Perfil e Profissional.

### Enumerações

| Enumeração | Valores |
| --- | --- |
| CodigoPerfil | ADOLESCENTE, ADULTA, IDOSA, GESTANTE, PUERPERIO, TENTANTE, EVITANDO\_GRAVIDEZ, DOENCA\_GINECOLOGICA, VIVENDO\_COM\_HIV, LGBTQIA |
| TipoLembrete | EXAME, VACINA, CONSULTA, MEDICAMENTO, CONTRACEPTIVO, SEMANA\_GESTACIONAL |
| StatusLembrete | PENDENTE, CONCLUIDO, ADIADO, CANCELADO |
| TipoMetodo | PILULA, DIU, INJETAVEL, ANEL, PRESERVATIVO, IMPLANTE |
| Formato | TEXTO, IMAGEM, ANIMACAO, FAQ |
| StatusPergunta | RECEBIDA, RESPONDIDA, ARQUIVADA |
| Fluxo | AUSENTE, ESCAPE, LEVE, MODERADO, INTENSO |
| TipoParto | VAGINAL, CESAREA |

### Onde ficam as regras

| Classe | Método | Regra aplicada |
| --- | --- | --- |
| Perfil | aplicavelA() | RN01, RN05 |
| Usuaria | alterarSituacao() | RN04, RN05, RN06, RN08 |
| AnalisadorCiclo | proximaMenstruacao(), janelaFertil(), irregular() | RN10, RN11, RN12 |
| UsoMetodo | proximaData() | RN13 |
| Gestacao | idadeGestacional(), dpp(), emPuerperio() | RN07, RN16 |
| Lembrete | proximaOcorrencia() | RN17, RN20 |
| Questionario | calcularResultado() | RN14, RN19 |
| PerguntaAnonima | responder() | RN23 |

## 8. Diagrama de componentes

A solução tem três camadas: dois clientes (app móvel e painel web de curadoria), um backend monolítico modular com 8 módulos e a camada de dados. Os documentos não definem tecnologias, então a arquitetura é uma proposta e não fixa linguagem nem framework.

&#91;embedded content: diagrama de componentes · 2 clientes, API com 8 módulos, 3 serviços de apoio\]

As notificações saem da API para o serviço de push e chegam ao aparelho. O agendamento na UBS é só um link aberto pelo app, sem troca de dados.

### Módulos do monólito

| Módulo | Responsabilidade | Casos de uso | Entidades principais |
| --- | --- | --- | --- |
| Contas e perfis | Cadastro, autenticação, modo confidencial e perfis ativos | UC01, UC02, UC03 | USUARIA, USUARIA\_PERFIL, USUARIA\_CONDICAO |
| Personalização | Decide quais painéis e conteúdos cada usuária enxerga | UC17 | PERFIL, CONTEUDO\_PERFIL |
| Ciclo e fertilidade | Calendário, análise do ciclo, janela fértil e alerta de irregularidade | UC05, UC06, UC18 | CICLO, REGISTRO\_DIARIO, SINTOMA |
| Gestação e puerpério | Idade gestacional, DPP, movimentos fetais, mamadas e humor | UC09, UC10 | GESTACAO, MOVIMENTO\_FETAL, MAMADA |
| Métodos e medicação | Método contraceptivo em uso e controle de medicamentos | UC08, UC12 | METODO, USO\_METODO, MEDICAMENTO |
| Lembretes | Agenda da usuária, lembretes automáticos e disparo de notificações | UC11, UC19 | LEMBRETE, NOTIFICACAO |
| Conteúdo e dúvidas | Conteúdos, guia de sintomas, chat automático, perguntas anônimas e UBSs | UC04, UC13, UC14, UC15, UC20, UC21, UC22 | CONTEUDO, PERGUNTA\_ANONIMA, UBS |
| Questionários | Quiz de métodos, checklists e escalas de avaliação | UC07, UC16 | QUESTIONARIO, QUESTAO, PREENCHIMENTO |

### Organização no GitHub

Front e back ficam no mesmo repositório GitHub (monorepo): o backend é um único deploy e cada módulo é uma pasta com fronteira explícita. Se preferirem repositórios separados, a estrutura de `apps/` se divide sem mudar os módulos.

```text
minha-saude-feminina/
├─ apps/
│  ├─ mobile/          # app Android e iOS
│  ├─ curadoria/       # painel web da equipe de saúde
│  └─ api/             # monólito modular (um só deploy)
│     └─ src/
│        ├─ modules/
│        │  ├─ contas/  personalizacao/  ciclo/  gestacao/
│        │  └─ metodos/  lembretes/  conteudo/  questionarios/
│        └─ shared/     # autenticação, erros, utilitários
├─ docs/               # esta especificação, MER e decisões (ADRs)
└─ .github/workflows/  # build, testes e verificação de fronteiras
```

| Regra do monólito modular | Efeito |
| --- | --- |
| Cada módulo expõe só uma interface pública; o restante (domínio, repositórios) é interno | Um módulo não importa classes internas de outro |
| Cada módulo é dono de suas tabelas e só ele as lê e grava | Dados de outro módulo vêm pela interface pública, sem JOIN entre módulos |
| Módulos se falam por chamada em processo; eventos internos para efeitos colaterais (ex.: parto registrado encerra a gestação e ativa o puerpério) | Sem rede entre módulos; fácil extrair um módulo depois, se for preciso |
| A pipeline do GitHub Actions roda testes e checa as fronteiras a cada pull request | Violação de fronteira reprova o PR |
| `main` protegida: merge só por pull request com revisão | Histórico rastreável |

## 9. Premissas e pontos em aberto

Quatro premissas sustentam os itens marcados como Derivado, e nove pontos precisam de decisão da equipe antes do desenvolvimento.

### Premissas adotadas

- Existe uma equipe de curadoria com painel administrativo; os documentos não dizem quem publica os conteúdos nem quem responde às perguntas anônimas.
- O link da UBS abre um agendamento externo; não há integração de dados com sistemas do SUS.
- O chat "É normal isso?" responde com conteúdo pré-aprovado, sem IA generativa.
- O produto é um app móvel para Android e iOS, com backend monolítico modular, banco relacional e código no GitHub.

### Pontos em aberto

- [ ] A seção "Funcionalidades essenciais transversais (para todos os perfis)" está sem itens em E p.6: confirmar quais são.
- [ ] A apresentação (A s.5) separa climatério e menopausa de senescência, mas E p.5 põe a menopausa só no painel de idosas (60+): definir se haverá perfil de climatério para menores de 60.
- [ ] Validar com a Medicina as fórmulas e os limites de RN10, RN11, RN12, RN15, RN16 e RN19.
- [ ] Escolher a escala de fragilidade (RF42) e o instrumento de rastreio de humor no puerpério (RF35).
- [ ] Definir quem responde às perguntas anônimas e em que prazo (RF47).
- [ ] Definir o município ou as UBSs atendidas e qual sistema de agendamento será ligado (RF45, RF46).
- [ ] Definir, com apoio jurídico, o consentimento para usuárias menores de 18 anos; a LGPD tem regra própria para crianças e adolescentes (art. 14).
- [ ] Confirmar as prioridades propostas para os requisitos funcionais.
- [ ] Escolher a pilha de tecnologia do app, da API e do banco.
