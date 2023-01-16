# CRUD-API

### Description

Implementation of simple CRUD API using in-memory database underneath.

### Install

1. git clone git@github.com//Pandobeer/CRUD-API.git
2. cd crud-api
3. npm install

make sure you use 18 LTS version of Node.js

### Usage

To run application, check scripts in package.json:
  * development mode - npm run start:dev
  
  * multi mode / load balancer - npm run start:multi 
  In multi mode it might take some time before the server will be ready to reply on requests.

  * production mode - npm run start:prod
    Bundle will be created, using webpack, and run in production mode

### Test
There are 4 tests implemented with jest: Get users, Create user, Get userById, Delete User.

To run tests use npm run test

### env
There is file .env.example in root directory with example of how should look your .env file.