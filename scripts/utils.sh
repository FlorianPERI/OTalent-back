#!/bin/bash

source ./scripts/colors.sh

npm_install(){
npm install
}

env(){
bash ./scripts/env.sh
}

init_db(){
bash ./scripts/init_db.sh
}

seed_db(){
npm run db:seed
}

start_server(){
npm run dev
}

menu(){
echo -ne "
${CYAN}O'Talent init menu
${PURPLE}Please enter a number to choose an option
${GREEN}1)${NOCOLOR} Install depedencies
${GREEN}2)${NOCOLOR} Set .env file
${GREEN}3)${NOCOLOR} Init / reset database
${GREEN}4)${NOCOLOR} Seed database
${GREEN}0)${NOCOLOR} Exit
${BLUE}Enter option:${NOCOLOR}"
read a
        case $a in
	        1) npm_install ; menu ;;
	        2) env ; menu ;;
	        3) init_db ; menu ;;
	        4) seed_db ; menu ;;
          5) start_server ; menu ;;
			0) exit 0 ;;
			*) echo -e $red"Wrong option."$clear; menu;;
        esac
}

menu
