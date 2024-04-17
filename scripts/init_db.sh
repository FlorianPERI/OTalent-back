#!/bin/bash

if [ -f .env ]
 then
   export $(cat .env | sed 's/#.*//g' | xargs)
 fi

psql -U $PGUSER -d $PGDATABASE -e -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname =  current_database();"
dropdb $PGDATABASE --if-exists -e -i
createdb $PGDATABASE -e
sqitch deploy
sqitch verify
