# O'Talent API

## Introduction

### What is O'Talent ?

O'Talent is a platform designed to meet the training and personal development needs of everyone. Whether you're seeking new professional skills, personal enrichment, or simply curious to explore new horizons, O'Talent offers a diverse range of courses tailored to all interests and skill levels.

One of O'Talent's main features is its extensive library of courses, covering a multitude of subjects ranging from foreign languages to computer programming, as well as personal development and well-being. Users have the opportunity to explore these various courses through detailed descriptions, user reviews, and ratings, helping them make decisions based on what best fits their needs and goals.

### About this API

## Requirements

[Node.js](https://nodejs.org/en) >= 16

[PostreSQL](https://www.postgresql.org/) >= 14

[Sqitch](https://sqitch.org/)

## Install

### Fastest way

```bash
./bin/install.sh
```

### Good old way

1. Install depedencies

```bash
npm i
```

2. Copy file `.env.example` as `.env`, or use the following command, and replace all variables with yours. Works with [dotenv](https://github.com/motdotla/dotenv).

```bash
cp .env.example .env
```

3. Create and seed the database

```bash
dropdb otalent
createdb otalent
sqitch deploy
sqitch verify
node data/seed.js
```

## How to use

### Endpoints

### Request Methods

### Responses

### Examples

### Status codes

```

```
