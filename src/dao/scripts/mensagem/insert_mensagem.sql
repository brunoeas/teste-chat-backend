INSERT INTO mensagem (id_usuario, ds_text, dh_enviado) VALUES ($1, $2, $3) RETURNING *;