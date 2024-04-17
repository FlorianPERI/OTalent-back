openssl genrsa -aes256 -out ssl/server.key.lock 4096
openssl rsa -in ssl/server.key.lock -out ssl/server.key
openssl req -new -key ssl/server.key.lock -out ssl/server.csr
openssl x509 -req -days 365 -in ssl/server.csr -signkey ssl/server.key.lock -out ssl/server.crt