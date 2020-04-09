# Full Stack Open 2020 - Exercise Solutions - Patientor Backend

## Part 9 - [Typescript](https://fullstackopen.com/en/part9)

## Routes

The server supports the following routes

- /api/ping - test route (GET)
- /api/diagnoses - for diagnosis resources (GET)
- /api/patients/ - for patient resources (GET, POST)
- /api/patients/:id - for patient members (GET)
- /api/patients/:id/entries - for entries of a patient (POST)

## usage

Run application in dev watch mode (ts-node-dev) with _npm run dev_

Build js files with _npm run tsc_

Rebuild (deleting all old files) with _npm run tsc:rebuild_

Built JavsScript src is emmited to /build folder

Start application (after build) with _npm start_

Run eslint with _npm run lint_
