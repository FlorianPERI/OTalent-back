#!/bin/bash

if [ -f .env ]
 then
   export $(cat .env | sed 's/#.*//g' | xargs)
 fi

dropdb $PGDATABASE --if-exists -e -i
createdb $PGDATABASE -e
sqitch deploy
sqitch verify
