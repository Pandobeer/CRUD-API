# CRUD-API

### Description

Implementation of simple CRUD API using in-memory database underneath.

### Install

1. Clone project repo git clone git@github.com:Pandobeer/CRUD-API.git
2. Go to project folder: cd crud-api
3. Switch to develop branch git checkout dev 
4. Install dependencies npm install
5. Create file .env in project root and add variables PORT and HOST, e.g PORT=4000. 
There is file .env.example in root directory with example of how should look your .env file.

Make sure you use 18 LTS version of Node.js

### Usage

To run application, check scripts in package.json:
  * development mode - npm run start:dev
  
  * multi mode / load balancer - npm run start:multi 
  In multi mode it might take some time before the server will be ready to reply on requests.

  * production mode - npm run start:prod
    Bundle will be created, using webpack, and run in production mode

### API

    GET api/users is used to get all persons
        Server should answer with status code 200 and all users records
    GET api/users/{userId}
        Server should answer with status code 200 and and record with id === userId if it exists
        Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    POST api/users is used to create record about new user and store it in database
        Server should answer with status code 201 and newly created record
        Server should answer with status code 400 and corresponding message if request body does not contain required fields
    PUT api/users/{userId} is used to update existing user
        Server should answer with status code 200 and updated record
        Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    DELETE api/users/{userId} is used to delete existing user from database
        Server should answer with status code 204 if the record is found and deleted
        Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
        Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist


### Test
There are 4 tests implemented with jest: Get users, Create user, Get userById, Delete User.
To run tests use npm run test