# Calculation microserver

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
`cocker-compose build`
`docker-compose up`

### How to run all but one service

To develop individual an service, in an integrated setup
`docker-compose down <name of service>`
and then follow how to run locally, for the service
