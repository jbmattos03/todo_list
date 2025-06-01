#!/bin/bash

JWT_SECRET=$(openssl rand -hex 32)

# Checar se o arquivo .env existe
if ! [ -e ".env" ]; then
    touch ./.env
fi

# Inserir variável JWT_SECRET no arquivo .env
if grep -q "^JWT_SECRET=" ./.env; then
    sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" ./.env
else
    echo "JWT_SECRET=$JWT_SECRET" >> ./.env
fi