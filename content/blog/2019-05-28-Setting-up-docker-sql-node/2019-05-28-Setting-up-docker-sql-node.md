---
layout: post
title: "Setting up Docker with a Node app"
comments: true
date: "2019-05-28"
---
Long time no post! Today I went through the torturous exercise of trying to set up my app with Docker. The most difficult aspect of this was trying to get my app to access my SQL DB. I can't guarantee this is the best way, but the TL;DR of it is:
1. Create and validate docker-compose.yml and .dockerfile files
2. Add files to project and push project to Github
3. Install docker, docker-compose, and git on your Amazon EC instance
4. Pull code from Github to Amazon EC2
5. Update security groups on EC2
6. Build your app using docker-compose.yml
7. Seed your data and verify your app

# Set up your docker-compose file
Your docker-compose has objectives:
1. Run your dockerfile, which will build your node service app and expose the app's port, e.g. 3005
2. Map the external port to the service app's internal port, e.g. 80:3005
3. Attach local directory to the container using volumes - this allows local changes to be reflected in your container

A docker-compose file with the above objectives might look like this:
```yaml
version: '3'

services:
  reviews:
    container_name: steam_reviews_app
    build: .
    depends_on:
      - 'database'
    ports: 
      - '80:3005'
    volumes:
      - ./:/src/app 

  database:
    container_name: steam_reviews_db
    image: mysql:5.7
    ports: 
      - '3306:3306'
    environment:
      - MYSQL_DATABASE=steam
      - MYSQL_ROOT_PASSWORD=secretpassword
```

The database portion **is important!** Whatever name you call it, e.g. 'database', you will be able to reference it in your database connection code, e.g.
```javascript
const sequelize = new Sequelize('testdb', 'root', 'secretpassword', {
  host: 'database',
  dialect: 'mysql'
});
```

Also note, port 3306 is MySQL's standard port, and we set up our root account password and initialize a database.

The docker file would look something like this:
```yaml
FROM node:latest

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN npm install

EXPOSE 3005

CMD ["npm", "start"]
```

Once we set up our docker files, we confirm image builds on our local machine, then commit everything and push to our github.

# EC2
## Create an EC2 instance
Nothing much to say here - it's easy enough using Amazon's interface. Create an Amazon AMI instance and follow steps to get the key to it.

## Set up access to instance via command line
This part's a little confusing if you make assumptions about how to get in. For whatever reason, they key Amazon gives you may be too open.
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for 'amazonec2.pem' are too open.
It is recommended that your private key files are NOT accessible by others.
This private key will be ignored.
bad permissions: ignore key: amazonec2.pem
Permission denied (publickey).
```

First fix is to try updating chmod
```
chmod 400 mykey.pem
```

If this doesn't work, the following worked for me.

 **Note:** you login to the server as ec2-user, not your Amazon username.

step 1: add your key to ssh
```
ssh-add ~/.ssh/KEY_PAIR_NAME.pem
```

step 2: ssh in
```
ssh user_name@<instance public dns/ip>
```
e.g.
```
ssh ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
```

Alternatively if you don't want to add your key to your system, you can login with
```
ssh -i KEY_PAIR_NAME.pem ec2-user@ec2-198-51-100-1.compute-1.amazonaws.com
```

## Security Groups
Finally, you'll want to make sure whatever port you are exposing to the public is permissioned.

1. Go to your instance, and check the security group 
2. Go to Security Groups and look up the group
3. Edit the group by adding the desired port, e.g. 80 if your docker-compose contained 80:3005
4. Allow all traffic

# Installations on EC2
Now that we an access EC2, we need to install Git, Docker, and Node.

## Git
```
sudo yum install git -y
```

## Docker
```
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

Then logout and back in to the EC2 server. Confirm with
```
docker info
```

## Docker-compose
```
sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-`uname -s`-`uname -m` | sudo tee /usr/local/bin/docker-compose > /dev/null
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

# Run app
## Build
1. Pull your code from Github
2. Run 'docker-compose up'

## Seed data
You might need to seed some data. If so, you can't do this from your local machine or directly from the EC2 instance. From the EC2 instance, you'll need to access the bash shell for the app container
```
> docker exec -it app_container bash
```

Once inside your container's shell, you can run your seed script. It's important you're inside your container, since only your container has the reference to the 'database' variable name we established in the docker-compose.yml. From your local or from the EC2 instance the variable has no meaning.

Your app should now be running! If it's not, check:
- Server security groups
- DB connection code contains the database name from your docker-compose.yml

# Sources
https://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container

https://stackoverflow.com/questions/50177216/how-to-grant-all-privileges-to-root-user-in-mysql-8-0/50197630

https://stackoverflow.com/questions/1559955/host-xxx-xx-xxx-xxx-is-not-allowed-to-connect-to-this-mysql-server

https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server