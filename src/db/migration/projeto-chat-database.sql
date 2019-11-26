-- CREATING TABLES

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario serial PRIMARY KEY,
  nm_usuario VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS mensagem (
  id_mensagem serial PRIMARY KEY,
  ds_text TEXT NOT NULL,
  dh_enviado TIMESTAMP WITH TIME ZONE NOT NULL,
  id_usuario INTEGER REFERENCES usuario (id_usuario)
);