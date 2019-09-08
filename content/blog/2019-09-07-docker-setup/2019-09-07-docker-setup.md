---
layout: post
title: "Docker deeper dive"
comments: true
date: "2019-09-07"
---
# Common challenges using Docker
## docker-compose depends_on
**Common error messages:** econnrefused

A common misconception of *depends_on* is that during a container build, service dependencies will complete their build and initialization before services that depend on them will start. In actuality it's not a "must finish to start" dependency, but rather a "must start to start" dependency.

From Docker's [own docks](https://docs.docker.com/compose/startup-order/):
``
However, for startup Compose does not wait until a container is “ready” (whatever that means for your particular application) - only until it’s running.
``

This means if you have the expectation that your service will attempt to connect to your DB after your DB has initialized, it will likely attempt to do so prematurely, and fail the connection.

The solution is to find a way to perform checks until dependencies are ready. There are many tools available:
- [Wait-for-it](https://github.com/vishnubob/wait-for-it)
- [Dockerize](https://github.com/jwilder/dockerize)
- [Wait-for](https://github.com/Eficode/wait-for)

Wait-for has a simple implementation for a DB dependency:
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
COMMAND    PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
mysqld    1785 ericdo   25u  IPv4 0xe2f57dcefcc637e9      0t0  TCP localhost:mysql (LISTEN)
```

This means the container is listening to port 3306. 

Even if we map a host port 3307 to 3306, e.g.:
```yaml
PORTS:
 - "3307:3306"
```
**This does not mean the container is listening to port 3307**. 

When other containers try to access the MySQL DNS, they will still try to access from port 3306, since it is the MySQL default. 

You should expose the container's port 3306, and make sure that incoming requests from port 3306 are mapped to the container's port 3306.

```yaml
PORTS:
 - "3307:3306"
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

Your config code likely needs to be updated:
```yaml
  host: "database",
  dialect: "mysql",
```
## Seeding your database
https://stackoverflow.com/questions/31210973/how-do-i-seed-a-mongo-database-using-docker-compose