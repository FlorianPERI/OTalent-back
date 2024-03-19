#!/bin/bash

npm i
[[ -f .env ]] || cp .env.example .env
[[ -f sqitch.conf ]] || cp sqitch.conf.example sqitch.conf

echo "Please enter your environnement variables. Enter empty value to keep previous value."
read -p "Enter server port to use: " new_SERVER_PORT
read -p "Enter db hostname: " new_PGHOST
read -p "Enter db name: " new_PGDATABASE
read -p "Enter db username: " new_PGUSER
read -p "Enter db password: " new_PGPASSWORD
read -p "Enter db ssl mode: " new_PGSSLMODE

file=".env"

if [ ! -z "$new_SERVER_PORT" ]; then
    sed -i "s/^SERVER_PORT=.*/SERVER_PORT=$new_SERVER_PORT/" $file
fi

if [ ! -z "$new_PGHOST" ]; then
    sed -i "s/^PGHOST=.*/PGHOST=$new_PGHOST/" $file
fi

if [ ! -z "$new_PGDATABASE" ]; then
    sed -i "s/^PGDATABASE=.*/PGDATABASE=$new_PGDATABASE/" $file
fi

if [ ! -z "$new_PGUSER" ]; then
    sed -i "s/^PGUSER=.*/PGUSER=$new_PGUSER/" $file
fi

if [ ! -z "$new_PGPASSWORD" ]; then
    sed -i "s/^PGPASSWORD=.*/PGPASSWORD=$new_PGPASSWORD/" $file
fi

if [ ! -z "$new_PGSSLMODE" ]; then
    sed -i "s/^PGSSLMODE=.*/PGSSLMODE=$new_PGSSLMODE/" $file
fi

echo "Variables have been updated in the file $file."

sh ./scripts/init_db.sh