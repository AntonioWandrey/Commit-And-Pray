# Simulador local do bot

Protótipo de conversa para o piloto do dia 20. O fluxo segue o guia do chatbot e oferece apenas **Registrar humor** e **Registrar queixa**.

## Abrir

Abra `index.html` em um navegador. O simulador não precisa de servidor, dependências ou credenciais.

## Usar

1. Escolha `Registrar humor` e uma opção guiada, ou `Registrar queixa` e um exemplo fictício.
2. Confira a prévia do evento no painel ao lado. Ela segue os campos propostos no guia: `mensagemId`, `remetenteRef`, `recebidaEm`, `tipo` e o conteúdo correspondente.
3. Reinicie a conversa para começar outra demonstração.

## Limites

- Todos os exemplos são fictícios. O fluxo de queixa usa opções prontas e não aceita texto livre.
- As respostas e a prévia são simuladas; nenhum evento é enviado ao backend ou gravado no Histórico.
- As entradas existem somente na memória da página. Não há `localStorage`, cookies próprios ou chamadas de rede.
- Autoatendimento, dicas e orientação ficam fora deste piloto.

## Integração futura

Quando o serviço do Histórico estiver disponível, substitua a criação local da prévia por uma chamada ao contrato acordado com o backend. Exiba confirmação de registro somente depois de o serviço confirmar a gravação.
