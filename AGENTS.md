# Commit and Pray

Use português brasileiro nas interações e na documentação do projeto.

## Estrutura

- `backend/cuidado-feminino-api/` contém a API Java 21, Spring Boot e MySQL.
- O aplicativo será desenvolvido em React Native com TypeScript e Expo para Android e iOS.
- O chatbot será um canal de entrada do diário. App e bot devem usar o mesmo serviço para registrar e consultar dados por conta.
- Consulte o [README](README.md) para executar a API e o [guia de transferência e chatbot](docs/transplante-e-chatbot.md) para os próximos passos.

## Backend

- Faça alterações de schema por migrações Flyway. Deixe o Hibernate validar o schema.
- Valide o titular e o perfil no servidor. A conta só consulta seus próprios registros. A publicação de conteúdo exige o perfil administrador.
- Mantenha o fluxo legado de registro disponível para ensaio local. A jornada nova de diário usa um contrato próprio.
- Use registros fictícios em testes e exemplos. Passe credenciais por configuração local e evite gravar relatos e mensagens em logs.
- Rode as verificações da área alterada. Para inicialização ou migração, use um schema MySQL de teste e confira a aplicação das migrações.
