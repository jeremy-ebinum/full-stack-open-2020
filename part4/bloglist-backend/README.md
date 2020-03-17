# Full Stack Open 2020 - Exercise Solutions

## Part 4 - [Testing Express servers, user administration](https://fullstackopen.com/en/part4)

### Exercises

- Exercises 4.1 - 4.2 — [Description](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2)
- Exercise 4.3 - 4.7 — [Description](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7)
- Exercise 4.8 - 4.12 — [Description](https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12)
- Exercise 4.13 - 4.14 — [Description](https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-13-4-14)
- Exercise 4.15 - 4.22 — [Description](https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-22)

A mongodb uri, secret_key and port need to be defined in the .env file in the project root directory\
See .env.example

## Routes

The server supports the following routes:

- /api/blogs - for blogs resources (GET, POST)
- /api/blogs/:id - for blogs members (GET, PUT, DELETE)
- /api/users - for users resources (GET, POST)
- /api/login - for users login (POST)

Additional routes with NODE_ENV=test:

- /api/testing/reset - to clear the database (POST)
- /api/testing/blogs - to fetch blogs in database (GET)
- /api/testing/users - to fetch users in database (GET)

## Available Scripts

### `npm start`

Runs the server on the defined port.

### `npm run start:test`

Runs the server with configurations to ease End-to-End testing/
Sets NODE_ENV to test and enables optional routes and a mocked db

### `npm run watch`

Runs the server in watch mode using nodemon. Changes to code will relaunch the server

### `npm test`

Tests the server api using jest and supertest

### `npm run lint`

Lints project with eslint
