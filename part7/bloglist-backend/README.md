# Full Stack Open 2020 - Exercise Solutions - Bloglist Backend

## Part 7 - [React router, custom hooks, styling app with CSS and webpack](https://fullstackopen.com/en/part7)

A mongodb uri, secret_key and port need to be defined in the .env file in the project root directory\
See .env.example

Serves [bloglist-frontend](https://github.com/jeremy-ebinum/full-stack-open-2020/tree/master/part7/bloglist-frontend) if built with `npm run build:ui`

## Routes

The server supports the following routes

- /api/blogs - for blogs resources (GET, POST)
- /api/blogs/:id - for blogs members (GET, PUT, DELETE)
- /api/blogs/:id/comments - for comments of a blog member (POST)
- /api/users - for users resources (GET, POST)
- /api/login - for users login (POST)

With NODE_ENV=test

- /api/testing/reset - to clear the database (POST)
- /api/testing/blogs - to fetch blogs in database (GET)
- /api/testing/users - to fetch users in database (GET)

## Available Scripts

### `npm start`

Runs the server on the defined port.

### `npm run start:test`

Sets up the server for cypress End-to-End tests

### `npm run watch`

Runs the server in watch mode using nodemon. Changes to code will relaunch the server

### `npm run build:ui`

Updates the build/ folder with the react ui from [bloglist-frontend](https://github.com/jeremy-ebinum/full-stack-open-2020/tree/master/part7/bloglist-frontend)

### `npm test`

Tests the server api using jest and supertest

### `npm run lint`

Lints project with eslint
