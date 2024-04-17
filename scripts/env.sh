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
read -p "$(echo -e ${BLUE}Enter password salt: ${NOCOLOR} )" new_PASSWORD_SALT
read -p "$(echo -e ${BLUE}Enter insee api key: ${NOCOLOR} )" new_INSEE_API_KEY
read -p "$(echo -e ${BLUE}Enter jwt token duration: ${NOCOLOR} )" new_JWT_DURATION
read -p "$(echo -e ${BLUE}Enter jwt token secret: ${NOCOLOR} )" new_JWT_SECRET
read -p "$(echo -e ${BLUE}Enter graph url endpoint for tests: ${NOCOLOR} )" new_GRAPH_TEST_URL
read -p "$(echo -e ${BLUE}Enter nodemailer key: ${NOCOLOR} )" new_NODEMAILER_KEY
read -p "$(echo -e ${BLUE}Enter nodemailer email: ${NOCOLOR} )" new_MAIL_ADDRESS
read -p "$(echo -e ${BLUE}Enter redis port: ${NOCOLOR} )" new_REDIS_PORT
read -p "$(echo -e ${BLUE}Enter redis password: ${NOCOLOR} )" new_REDIS_PASSWORD
read -p "$(echo -e ${BLUE}Enter redis url: ${NOCOLOR} )" new_REDIS_URL

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

if [ ! -z "$new_PASSWORD_SALT" ]; then
  sed -i "s/^PASSWORD_SALT=.*/PASSWORD_SALT=$new_PASSWORD_SALT/" "$envFile"
fi

if [ ! -z "$new_INSEE_API_KEY" ]; then
  sed -i "s/^INSEE_API_KEY=.*/INSEE_API_KEY=$new_INSEE_API_KEY/" "$envFile"
fi

if [ ! -z "$new_JWT_DURATION" ]; then
  sed -i "s/^JWT_DURATION=.*/JWT_DURATION=$new_JWT_DURATION/" "$envFile"
fi

if [ ! -z "$new_JWT_SECRET" ]; then
  sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$new_JWT_SECRET/" "$envFile"
fi

if [ ! -z "$new_GRAPH_TEST_URL" ]; then
  sed -i "s/^GRAPH_TEST_URL=.*/GRAPH_TEST_URL=$new_GRAPH_TEST_URL/" "$envFile"
fi

if [ ! -z "$new_NODEMAILER_KEY" ]; then
  sed -i "s/^NODEMAILER_KEY=.*/NODEMAILER_KEY=$new_NODEMAILER_KEY/" "$envFile"
fi

if [ ! -z "$new_MAIL_ADDRESS" ]; then
  sed -i "s/^MAIL_ADDRESS=.*/MAIL_ADDRESS=$new_MAIL_ADDRESS/" "$envFile"
fi

if [ ! -z "$new_REDIS_PORT" ]; then
  sed -i "s/^REDIS_PORT=.*/REDIS_PORT=$new_REDIS_PORT/" "$envFile"
fi

if [ ! -z "$new_REDIS_PASSWORD" ]; then
  sed -i "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$new_REDIS_PASSWORD/" "$envFile"
fi

if [ ! -z "$new_REDIS_URL" ]; then
  sed -i "s/^REDIS_URL=.*/REDIS_URL=$new_REDIS_URL/" "$envFile"
fi

new_PGURL="postgresql://$PGUSER:$PGPASSWORD@$PGHOST/$PGDATABASE?sslmode=$PGSSLMODE"
sed -i "s|^PGURL=.*|PGURL=$new_PGURL|" "$envFile"

echo "Variables have been updated in the file $envFile."

new_TARGET="db:pg://$PGUSER:$PGPASSWORD@$PGHOST/$PGDATABASE?sslmode=$PGSSLMODE"
echo "New target URL: $new_TARGET"
sed -i "s|^target=.*|target=$new_TARGET|" "$sqitchFile"

echo "Variables have been updated in the file $sqitchFile."