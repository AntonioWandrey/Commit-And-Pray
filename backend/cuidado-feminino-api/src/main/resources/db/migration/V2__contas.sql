CREATE TABLE ubs
(
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome               VARCHAR(150) NOT NULL,
    endereco           VARCHAR(255),
    telefone           VARCHAR(30),
    link_agendamento   VARCHAR(500),
    acolhedora_lgbtqia BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE perfil
(
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo    VARCHAR(50)  NOT NULL UNIQUE,
    nome      VARCHAR(100) NOT NULL,
    tipo      VARCHAR(20)  NOT NULL
        CHECK (tipo IN ('ETARIO', 'SITUACAO', 'CONDICAO', 'IDENTIDADE')),
    idade_min SMALLINT,
    idade_max SMALLINT,
    CHECK (idade_min IS NULL OR idade_max IS NULL OR idade_max >= idade_min)
);

CREATE TABLE usuario
(
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome                   VARCHAR(150) NOT NULL,
    nome_social            VARCHAR(150),
    identidade_genero      VARCHAR(50),
    data_nascimento        DATE         NOT NULL,
    email                  VARCHAR(255) NOT NULL,
    senha_hash             VARCHAR(255) NOT NULL,
    visual_neutro          BOOLEAN      NOT NULL DEFAULT FALSE,
    modo_confidencial      BOOLEAN      NOT NULL DEFAULT FALSE,
    ubs_id                 BIGINT REFERENCES ubs (id),
    consentimento_saude_em TIMESTAMPTZ  NOT NULL, -- fora do MER (LGPD)
    versao_termo           VARCHAR(20)  NOT NULL, -- fora do MER (LGPD)
    criado_em              TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX usuario_email_uk ON usuario (lower(email));
CREATE INDEX usuario_ubs_idx ON usuario (ubs_id);

CREATE TABLE usuario_perfil
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id  BIGINT NOT NULL REFERENCES usuario (id) ON DELETE CASCADE,
    perfil_id   BIGINT NOT NULL REFERENCES perfil (id),
    data_inicio DATE   NOT NULL DEFAULT CURRENT_DATE,
    data_fim    DATE,
    CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);

-- uma pessoa não pode ter o mesmo perfil ativo duas vezes
CREATE UNIQUE INDEX usuario_perfil_ativo_uk
    ON usuario_perfil (usuario_id, perfil_id) WHERE data_fim IS NULL;
CREATE INDEX usuario_perfil_perfil_idx ON usuario_perfil (perfil_id);