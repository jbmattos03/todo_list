#!/bin/bash

JWT_SECRET=$(openssl rand -hex 32)
DB_NAME="todo_list"
DB_USER="todo_user"
DB_PASSWORD=$(openssl rand -base64 16)
DB_HOST="localhost"
PORT="8081"

# Checar se o arquivo .env existe
if ! [ -e ".env" ]; then
    touch ./.env
fi

# Inserir variáveis de ambiente no arquivo .env
# JWT_SECRET
if grep -q "^JWT_SECRET=" ./.env; then
    sed -i "s#^JWT_SECRET=.*#JWT_SECRET=$JWT_SECRET#" ./.env
else
    echo "JWT_SECRET=$JWT_SECRET" >> ./.env
fi

# Solicitar senha root para criar o banco de dados
echo "Please enter your MySQL root password to create the database and user:"
read -s MYSQL_ROOT_PASSWORD

# Criar usuário se não existir
if ! mysql -u root -p"$MYSQL_ROOT_PASSWORD" -sN -e "SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = '$DB_USER');" | grep -q 1; then
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE USER '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASSWORD';"
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST';"
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "FLUSH PRIVILEGES;"

    echo "User $DB_USER created and granted privileges on $DB_NAME."
else 
    echo "User $DB_USER already exists."
fi

# DB_NAME
if grep -q "^DB_NAME=" ./.env; then
    sed -i "s#^DB_NAME=.*#DB_NAME=$DB_NAME#" ./.env
else
    echo "DB_NAME=$DB_NAME" >> ./.env
fi

# DB_USER
if grep -q "^DB_USER=" ./.env; then
    sed -i "s#^DB_USER=.*#DB_USER=$DB_USER#" ./.env
else
    echo "DB_USER=$DB_USER" >> ./.env
fi

# DB_PASSWORD
if grep -q "^DB_PASSWORD=" ./.env; then
    sed -i "s#^DB_PASSWORD=.*#DB_PASSWORD=$DB_PASSWORD#" ./.env
else
    echo "DB_PASSWORD=$DB_PASSWORD" >> ./.env
fi

# DB_HOST
if grep -q "^DB_HOST=" ./.env; then
    sed -i "s#^DB_HOST=.*#DB_HOST=$DB_HOST#" ./.env
else
    echo "DB_HOST=$DB_HOST" >> ./.env
fi

# PORT
if grep -q "^PORT=" ./.env; then
    sed -i "s#^PORT=.*#PORT=$PORT#" ./.env
else
    echo "PORT=$PORT" >> ./.env
fi

# Ask the user for their preferred log level
echo "Please enter your preferred log level (e.g., debug, info, warn, error):"
read LOG_LEVEL

# LOG_LEVEL
if grep -q "^LOG_LEVEL=" ./.env; then
    sed -i "s#^LOG_LEVEL=.*#LOG_LEVEL=$LOG_LEVEL#" ./.env
else
    echo "LOG_LEVEL=$LOG_LEVEL" >> ./.env
fi