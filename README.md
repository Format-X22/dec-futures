<p style='text-align: center'>
  <img alt="3Commas" src="https://3commas.io/assets/bittrix_landing/logo-dc9cce06dcd7724e67eba910fdd0c93da89a13d3cd628f180fb689823fa9d0cc.svg" width='300px'>
</p>

## Description

DEX futures tools.

## Installation

1 - Install NodeJS (LTS)

https://nodejs.org/

2 - Install Docker

https://www.docker.com/get-started

3 - Install packages

```bash
$ yarn install
```

## Configuration

Create .env file like .env.example

Variables:

`F_MONGO_CONNECT` - Mongo connection path. 

In dev mode use vars from example file.

## Running the app

```bash
# build all
$ yarn run build:all:stage
$ yarn run build:all:production

# start db (dev)
$ yarn run start:dev-db

# api microservice (dev)
$ yarn run start:api

# aggregator microservice (dev)
$ yarn run start:agg

# production bare metal mode
# (configure .env)
$ yarn run start:prod:api
$ yarn run start:prod:agg
```

# Tests

```bash
# units
$ yarn run test

# e2e
$ yarn run test:e2e:api
$ yarn run test:e2e:agg
```

## Api

App - http://localhost:3100/  
GraphQL - http://localhost:3100/graphql/
