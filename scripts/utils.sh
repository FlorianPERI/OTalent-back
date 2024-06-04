#!/bin/bash

source colors.sh

npm_install(){
npm install
}

env(){
bash env.sh
}


init_db(){
bash init_db.sh
}

seed_fake_db(){
npm run db:seed:fake
}

seed_db(){
npm run db:seed
}

start_server(){
npm run server
}

menu(){
echo -ne "
${CYAN}O'Talent init menu
${PURPLE}Please enter a number to choose an option ${NOCOLOR}
${GREEN}1)${NOCOLOR} Install depedencies
${GREEN}2)${NOCOLOR} Set .env file
${GREEN}3)${NOCOLOR} Init / reset database
${GREEN}4)${NOCOLOR} Seed database
${GREEN}5)${NOCOLOR} Start server
${GREEN}9)${NOCOLOR} Seed database with fake data
${GREEN}0)${NOCOLOR} Exit
${BLUE}Enter option:${NOCOLOR}"
read a
        case $a in
	        1) npm_install ; menu ;;
	        2) env ; menu ;;
          3) init_db ; menu ;;
	        4) seed_db ; menu ;;
          5) start_server ; menu ;;
	        9) seed_fake_db ; menu ;;
			0) exit 0 ;;
			*) echo -e $red"Wrong option."$clear; menu;;
        esac
}

menu