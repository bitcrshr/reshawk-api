# Reshawk API

After cloning, be sure to run `npm i` in the project directory to install project directory.

## Running for Development
Make sure that you have Docker Desktop installed. Then, in you project directory, run `docker-compose up mongo -d`. This will start up the MongoDB container for the application and initialize the database with default collections.

Note that data persists *locally* in the `data` directory in the project folder. If you want a fresh start, stop the mongo docker container, delete the `data` directory, and start the mongo docker container again. Do not push data to Github for security reasons.

After the mongo container is running, you can run `npm run watch-and-run` in the project directory.

You will be able to access the API endpoint at `http://localhost:3030`.

## Running for Production
In the project directory, run `docker-compuse up -d`. This exposes the API endpoint on `http://localhost:80`. Note that changes made to your code will not be reflected here. 