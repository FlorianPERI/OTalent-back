#!/bin/bash

if [ -f .env ]
 then
   export $(cat .env | sed 's/#.*//g' | xargs)
 fi

dropdb $PGDATABASE --if-exists -e -i -h $PGHOST
createdb $PGDATABASE -e -h $PGHOST
sqitch deploy
sqitch verify
node data/seed.js