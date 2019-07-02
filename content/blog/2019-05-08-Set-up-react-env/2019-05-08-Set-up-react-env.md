---
layout: post
title: "Setting up the SERN stack"
comments: true
date: "2019-05-08"
---
I'm currently working on building React apps without create-react-app. This post is about setting up the enviornment with respect to the SERN (SQL, Express, React, Node) stack.

# Setup

## TL;DR
Ulimately you'll want these running concurrently:
* [ ] MySQL server
* [ ] Nodemon (auto builds Node and Express BE, and serves your React app)
* [ ] Babel (dynamically transpile your React app)

Nodemon auto builds Node and Express BE, and serves your React app. Babel dynamically transpiles your React app.

When there's no backend I'd normally use live-server to run my React code, which automatically reloads when it detects changes. When there's no backend though, Nodemon will do that job.

## Install dependencies
Normally we'd expect a package.json file with dependencies listed for npm install. You should install from there rather than trusting any global installs, but this is included for reference in case it's needed for this week's projects.
```
  "dependencies": {
    "babel-cli": "^6.26.0",
    "nodemon": "^1.19.0",
    "react": "^16.8.6",
    "babel-plugin-react": "1.0.0",
    "babel-preset-react": "^6.5.0",
    "jquery": "^2.2.1",
    "live-server": "^1.2.1",
    "react-dom": "^0.14.7"
  }
```


## Run environments
### Babel
* Install locally if your global installation is having problems
* Include --watch at the end of the script
```
babel . --out-dir compiled --presets=react --ignore=node_modules,compiled --source-maps inline --watch
```

### live-server
I didn't actually use live-server this time, but am including it for referene. Live server looks for an index.html file _in the directory you run it from_. **Make sure to link your compiled component(s) in your index.html**.
```
live-server
```
```html
  <body>
    <script type="module" src="compiled/client/app.js"></script>
  </body>
```

### Nodemon
Run your server with:
```
nodemond server.js
```

You can do a quick Hello World with the code below. Going to your localhost:3000 should trigger the hello world message in your client.
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`Hello world!`);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
})
```

## SQL
### MySQL DB
Here's what a schema may look like for a user table
```sql
CREATE DATABASE shopping;

USE shopping;

CREATE TABLE users (
  id INT AUTO_INCREMENT,
  username VARCHAR(50),
  email VARCHAR(50),
  pswd VARCHAR(50),
  PRIMARY KEY (id)
);
```

You'd then load your schema with this script:
```
mysql -u root < path/to/schema.sql
```

### Sequelize
If you want to save yourself from some headache, it's nicer to use Sequelize. 

You still need to create your database either via script or manually, but the following code will sync and create your user table if it doesn't exist.

```javascript
const mysql = require('mysql2')
const Sequelize = require('sequelize');

var db = new Sequelize('shopping', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

db.authenticate()
.then(() => {
  console.log('Connection established');
})
.catch(err => {
  console.log('Error connecting to DB: ' + err);
});

const User = db.define('user', {
  username:   { type: Sequelize.STRING },
  email:      { type: Sequelize.STRING }, 
  password:   { type: Sequelize.STRING }
});

User.sync().then(() => {
  console.log('User table synced');
})
```

Create new users:
```javascript
User.create(user).then(data => {
      console.log('Record ID is: ' + data.id);
      res.send(data.id.toString());
    });
```

Update/insert users:
```javascript
    User.upsert(user).then(data => {
      console.log('User updated');
      res.status(200);
    });
```

Find users by key:
```javascript
User.findByPk(user.id).then((data) => {
    console.log('user found: ' + JSON.stringify(data.get()));
    res.send(data.get());
  })
```

## React
Include React in your index.html so it's available globally.
```html
  <head>
    <script src="node_modules/react/dist/react.js"></script>
    <script src="node_modules/react-dom/dist/react-dom.js"></script>
  </head>
  <body>
    <script type="module" src="compiled/client/app.js"></script>
  </body>
```

# Gotchas
## POSTS
Make sure your ajax call includes 'http://' even if you're using localhost, e.g. 
```javascript
 postData() {
    $.ajax({
      url: 'http://localhost:3000',
      method: 'POST', 
      data: JSON.stringify(this.state.user),
      success: () => console.log('success!'),
      error: () => console.log('error')
    });
  }
```

You MUST have urlencoded enabled for your bodyparser if you're going to be sending JSON over POST requests.

User enters data -> Data is saved to object -> Object is sent via POST with no stringify method -> Object is received and parsed on the server.

```javascript
postData() {
  $.ajax({
    url: 'http://localhost:3000',
    method: 'POST', 
    data: {user : this.state.user},
    success: () => console.log('success!'),
    error: () => console.log('error')
  });
}
```

```javascript
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.post('/', (req, res) => {
  console.log(req.body.user);
});
```

Output: 
```json
{ name: 'test', email: 'test', password: 'test' }
```