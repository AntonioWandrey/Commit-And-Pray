# CommitAndPray

Projeto de saúde feminina para a trilha Saúde e Bem-Estar. A demonstração prevista registra humor e queixas por conversa e apresenta esses registros no histórico do aplicativo React Native.

A base transferida do Cuidado Feminino está em [backend/cuidado-feminino-api](backend/cuidado-feminino-api). Ela usa Java 21, Spring Boot, Maven Wrapper e MySQL. O app React Native e o bot fazem parte das próximas etapas. O [guia de transferência e chatbot](docs/transplante-e-chatbot.md) descreve a base, a ordem de implementação e como começar o bot local.

## Rodar a API localmente

Instale o JDK 21 e inicie o MySQL local. Crie um schema vazio chamado `commitandpray_dev` ou ajuste a URL abaixo para outro schema de desenvolvimento. Use uma conta MySQL com acesso e permissão para criar e alterar tabelas nesse schema. O Flyway aplica as migrações `V1` e `V2`, e o Hibernate valida o resultado.

Na raiz deste repositório, configure as credenciais na sessão do PowerShell.

```powershell
Set-Location backend/cuidado-feminino-api
java -version

$env:SPRING_DATASOURCE_URL = 'jdbc:mysql://127.0.0.1:3306/commitandpray_dev'
$credencial = Get-Credential -Message 'Informe as credenciais do MySQL local'
$env:SPRING_DATASOURCE_USERNAME = $credencial.UserName
$env:SPRING_DATASOURCE_PASSWORD = $credencial.GetNetworkCredential().Password

.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

O Maven Wrapper pode precisar de acesso à internet para baixar o Maven e as dependências na primeira execução. O teste de contexto usa o schema local configurado. Quando a API subir, o endereço padrão é `http://127.0.0.1:8080`. Use um schema dedicado e dados sintéticos no desenvolvimento.
