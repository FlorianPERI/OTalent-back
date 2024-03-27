#!/bin/bash

source ./scripts/colors.sh

[[ -f .env ]] || cp .env.example .env
[[ -f sqitch.conf ]] || cp sqitch.conf.example sqitch.conf

if [[ -f .env ]]; then
    source .env
fi


echo -e "${PURPLE}Please enter your environnement variables. Press Enter without value to keep previous value.${BLUE}"
read -p "$(echo -e ${BLUE}Enter server port to use:${NOCOLOR} ) " new_SERVER_PORT
read -p "$(echo -e ${BLUE}Enter db hostname: ${NOCOLOR} )" new_PGHOST
read -p "$(echo -e ${BLUE}Enter db name: ${NOCOLOR} )" new_PGDATABASE
read -p "$(echo -e ${BLUE}Enter db username: ${NOCOLOR} )" new_PGUSER
read -p "$(echo -e ${BLUE}Enter db password: ${NOCOLOR} )" new_PGPASSWORD
read -p "$(echo -e ${BLUE}Enter db ssl mode: ${NOCOLOR} )" new_PGSSLMODE

envFile=".env"
sqitchFile="sqitch.conf"

if [ ! -z "$new_SERVER_PORT" ]; then
    sed -i "s/^SERVER_PORT=.*/SERVER_PORT=$new_SERVER_PORT/" "$envFile"
fi

if [ ! -z "$new_PGHOST" ]; then
    sed -i "s/^PGHOST=.*/PGHOST=$new_PGHOST/" "$envFile"
    PGHOST=$new_PGHOST
fi

if [ ! -z "$new_PGDATABASE" ]; then
    sed -i "s/^PGDATABASE=.*/PGDATABASE=$new_PGDATABASE/" "$envFile"
    PGDATABASE=$new_PGDATABASE
fi

if [ ! -z "$new_PGUSER" ]; then
    sed -i "s/^PGUSER=.*/PGUSER=$new_PGUSER/" "$envFile"
    PGUSER=$new_PGUSER
fi

if [ ! -z "$new_PGPASSWORD" ]; then
    sed -i "s/^PGPASSWORD=.*/PGPASSWORD=$new_PGPASSWORD/" "$envFile"
    PGPASSWORD=$new_PGPASSWORD
fi

if [ ! -z "$new_PGSSLMODE" ]; then
    sed -i "s/^PGSSLMODE=.*/PGSSLMODE=$new_PGSSLMODE/" "$envFile"
    PGSSLMODE=$new_PGSSLMODE
fi

new_PGURL="postgresql://$PGUSER:$PGPASSWORD@$PGHOST/$PGDATABASE?sslmode=$PGSSLMODE"
sed -i "s|^PGURL=.*|PGURL=$new_PGURL|" "$envFile"

echo "Variables have been updated in the file $envFile."

new_TARGET="db:pg://$PGUSER:$PGPASSWORD@$PGHOST/$PGDATABASE?sslmode=$PGSSLMODE"
echo "New target URL: $new_TARGET"
sed -i "s|^target=.*|target=$new_TARGET|" "$sqitchFile"

echo "Variables have been updated in the file $sqitchFile."