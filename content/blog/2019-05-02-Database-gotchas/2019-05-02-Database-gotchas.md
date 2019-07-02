---
layout: post
title: "Database Gotchas"
comments: true
date: "2019-05-02"
---

Let's review some hard learning lessons from our database project.

## Tables
### Create tables
When creating tables, if there are foreign keys, **the referenced tables must be created first**. For example, if you have a table of messages referencing a user table, the user table must be created first (otherwise what is the messages table referencing?).

```sql
CREATE DATABASE chat;

USE chat;

/* Create other tables and define schemas for them here! */
-- TODO: figure out if AUTO_INCREMENT is doable in scope of project
CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  PRIMARY KEY (user_id)
);

-- TODO: figure out if AUTO_INCREMENT is doable in scope of project
CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  text_msg VARCHAR(255) NOT NULL,
  room VARCHAR(20) NOT NULL,
  user_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```
### Truncating tables with foreign keys
You *cannot* truncate tables that contain keys which other tables depend on as foreign keys, e.g. if your _messages_ table has the ID field from your _users_ table as a foreign key, you need to disable foreign key checks for users first. If you're doing this in NodeJS you will need to chain them in callbacks/promises.

```sql
    dbConnection.query('TRUNCATE ' + messagesTable, (err, data) => {
      dbConnection.query('SET FOREIGN_KEY_CHECKS = 0', (err, data) => {
        dbConnection.query('TRUNCATE ' + usersTable, (err, data) => {
          dbConnection.query('SET FOREIGN_KEY_CHECKS = 1;', done);
        });
      });
    });
```

## Escape characters in template literals
A SQL string may contain a singlequote. Special characters need to be escaped, and NodeJS mySQL has a function to escape characters - escape(). NOTE, it wraps the string in singlequotes, so you don't need to wrap your variable anymore if you use escape().
```javascript
db = mysql.createConnection({
    user: 'student',
    password: 'student',
    database: 'chat'
  });
  db.connect();

 var query = `INSERT INTO messages (text_msg, room, user_id) 
              VALUES (${db.escape(message.message)}, '${message.roomname}', ${user_id})`;
```

