# Microservices example

## How to run
To run the Microservices just navigate to the route of the directory in your terminal and run
```
docker-compose up --build
```
 This will build each microservice and then provision each container.

Once all containers are up and running you can then hit the api on
```
http://localhost:8080
```

## The services

Currently there are 4 services:

`Users` : `/api/users`
`Cars` : `/api/cars`
`Search` : `/api/search`

`nginx` ties them all together

both `/users` and `/cars` have GET and POST methods.

to create a new car POST to `localhost:8080/api/cars` with JSON body:
```
{
  "name": "mustang",
  "registration": "WD40 LOL"
}
```

to create a new user POST to `localhost:8080/api/users` with JSON body:
```
{
  "username": "user",
  "password": "password"
}
```

The `/api/users` endpoint just merges the GET methods together.