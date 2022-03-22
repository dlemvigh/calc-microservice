# Calculation microservice

Yet another demo project about microservices. The idea is put difficult calculations into a jobs queue, and have a scalable number of workers.

The difficult calculation in this case is factorials of large numbers `n!`

## Architecture

![Architecture diagram](/calc-microservice-architecture.jpg)

### Calc-web

Website for creating calculation jobs, and view pending and finished calculations.

### Calc-api

Rest api for calculation jobs. Allows website to create jobs, and view status. Allows workers to post results. Stores information in its own database. Only the api has access to the database.

### Calc-api-db

Stores calculation jobs, their status and results.

### Calc-queue

Queue of pending calculations

### Calc-worker

Listens for jobs on the queue. Posts results back to calc-api.

## How to run locally

### How to run all

There is a docker-compose file, so all services can be spun up using
`docker-compose build`
`docker-compose up`

#### Run in background

Up will display the logs of all services, prefixed with their container name. To run the services in the background run `docker-compose up -d`

### How to run all but one service

To develop individual an service, in an integrated setup `docker-compose up -d <name-of-service> <name-of-service> ...` or `docker-compose up -d && docker-compose down <name of service>`
and then follow how to run locally, for the service

## How to test

All services run tests, just before the build step, in their Dockerfiles. Running `docker-compose build` therefor also runs tests.

### Test coverage

Each project can generate a test coverage report, by running `npm run test:coverage`. It outputs to the terminal, and a html report.

### Integration test

There is a cypress integration test, that can be run with `docker-compose run cypress`.

It is part of the services listed in the docker-compose file, but is ignore by `up`, unless explicitly mentioned by name or profile.

## Current state of progress

All services work: web client, api, queue, workers. Some even have multiple implementations.

### Web

* Create-react-app, static build, served with nginx
* NextJS

### Worker

* Node
* C#
* (incomplete rust, on a branch)

None of the implementations are particularly optimized, and use a simple/naive implementation of looping to calculate factorials. There are no attempts at parallel processing, or memory optimizations.

### Deployment

There is a docker-compose base setup, that works for local development, and testing in CI.

There is a few kubernetes yaml files for services/deployments, but not a full setup (there is a branch with an incomplete helm deploy).
