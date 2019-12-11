---
layout: post
title: "Common challenges using Docker"
comments: true
date: "2019-09-07"
---
## docker-compose depends_on
**Common error messages:** 
```
econnrefused
```
**Clue:** in your logs, you can see your service attempting to connect to your database container, despite your database container still in the process of initialization

A common misconception of *depends_on* is that during your container builds, dependencies will complete their build before services that depend on them will start their respective builds. In actuality, *depends_on* is not a "must finish to start" dependency, but rather a "must start to start" dependency.

From Docker's [own docs](https://docs.docker.com/compose/startup-order/):
``
For startup Compose does not wait until a container is “ready” (whatever that means for your particular application) - only until it’s running.
``

This means if you have your database container as a dependency of your service container and have the expectation that your service will attempt to connect to your DB only after your DB has finished setup, it will likely attempt to do so prematurely, and fail the connection.

The solution is to find a way to perform checks until dependencies are ready. There are many tools available:
- [Wait-for-it](https://github.com/vishnubob/wait-for-it)
- [Dockerize](https://github.com/jwilder/dockerize)
- [Wait-for](https://github.com/Eficode/wait-for)

Wait-for has a simple implementation for a DB dependency. You can see in the example code below that the db service will begin first due to *depends_on*. The wait-for script allows the backend service to wait until db is complete before executing the *npm start* command.
```yaml
version: '2'

services:
  db:
    image: postgres:9.4

  backend:
    build: backend
    command: sh -c './wait-for db:5432 -- npm start'
    depends_on:
      - db
```

## MySQL connection problems
### Exposing MySQL's default port
**Common error messages:**
```
SequelizeConnectionRefusedError: connect ECONNREFUSED 127.0.0.1:3307
```
By default, MySQL runs on port 3306. If you have MySQL running on your local machine, you can see this for yourself:
```
$ sudo lsof -i tcp:3306
```
```
COMMAND    PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
mysqld    1785 ericdo   25u  IPv4 0xe2f57dcefcc637e9      0t0  TCP localhost:mysql (LISTEN)
```

This means the MySQL container is running on port 3306. 

We may currently be mapping a host port 3307 to 3306, e.g.:
```yaml
PORTS:
 - "3307:3306"
```

It may be that when other containers try to access the MySQL DNS, they will still try to access using port 3306, since it is the MySQL default. If so, we should consider exposing the container's port 3306, and make sure that incoming requests to port 3306 are correctly mapped.

```yaml
PORTS:
 - "3306:3306"
```

### Database host name
**Common error messages:** 
```
SequelizeHostNotFoundError: getaddrinfo ENOTFOUND database
```

During development, you likely configured your database host to localhost, i.e.
```yaml
  host: "localhost",
  dialect: "mysql",
```

Once we create our containers though, it's not localhost that hosts the database, it's the respective container.

So if your docker-config.yml file looks like this:
```yaml
database:
  image: mysql:5.7
  ports:
    - '3306:3306'
```

Your host is not localhost, but rather "database". Your config code needs to be updated:
```yaml
  host: "database",
  dialect: "mysql",
```
## Seeding your database
This StackOverflow [article](https://stackoverflow.com/questions/31210973/how-do-i-seed-a-mongo-database-using-docker-compose) is very detailed and should be used for reference.