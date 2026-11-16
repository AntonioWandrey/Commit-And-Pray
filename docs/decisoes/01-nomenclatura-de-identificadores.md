# 0001 — Nomenclatura de identificadores

**Status:** proposta (aguardando aprovação do time)
**Data:** 2026-11-15

## Decisão

Identificadores de código e banco de dados em português, sem acento e sem
marca de gênero: `usuario` em vez de `usuaria` (tabelas `usuario`,
`usuario_perfil`, `usuario_condicao`; colunas `usuario_id`; classe `Usuario`).

## Motivo

- `usuario` é o termo técnico padrão e facilita bibliotecas e novos membros.
- O app atende pessoas de diferentes identidades de gênero
  (`identidade_genero`, `nome_social`, `acolhedora_lgbtqia`).
- "Usuária" continua na interface e na documentação em prosa.

## Consequências

- Todas as migrações e entidades seguem essa convenção.
- A especificação (MER, dicionário e diagramas) usa `USUARIO`.