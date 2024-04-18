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

[Redis](https://redis.io/)

## Install

### Fastest way

Use the following bash script to go step by step on the installation process

```bash
bash ./scripts/utils.sh
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
dropdb <DATABASE> --if-exists -e -i
createdb <DATABASE> -e
sqitch deploy
sqitch verify
npm db:seed
```

4. Start the server

```bash
npm run server
```

## How to use

### Endpoints

#### Apollo server

Apollo Sandbox endpoint

```bash
/graphql
```

#### Websocket

Used to handle Websocket connections. It contacts a Redis database and serve the data to the client to build a messaging tool.

```bash
/ws
```

### Query Examples

```js
query Member($memberId: ID!) {
  member(id: $memberId) {
    postal_code
    categories {
      label
      id
    }
    region
    nearestOrganizations {
      trainings {
        id
        label
        price
        image
        duration

        category {
          label
          id
        }
        dates
        organization {
          name
          id
        }
        created_at
        reviews {
          rating
        }
      }
    }
  }
}`
```

## Architecture

```
|- /app
  |- /graphql      - GraphQL application
  |- /services     - general helpers
|- /data
  |- /faker        - fake data generation
  |- /jsons        - real data files
  |- /migrations   - database deployement and versioning
  |- /utils        - functions used to build data
|- /docs        - docs of the project
|- /img         - images
|- /logs        - error log files
|- /tests       - unit tests (jest)
|- /scripts     - scripts that can be executed from CLI
|- server.js    - application main file
```
