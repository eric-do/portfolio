---
layout: post
title: "Intro to MongoDB with MongooseJS"
comments: true
date: "2019-05-12"
---
Today we from MongoDB installation to the import of your first document via MongooseJS..

Checklist
 - [ ] Install and run Mongo
 - [ ] Import Mongoose to your project
 - [ ] Define a schema
 - [ ] Create a document
 - [ ] Querying documents from the database
 - [ ] Sending documents to a client

# Install and run Mongo
We can't use Mongo without Mongo so let's start with installation. Instructions can be found [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb) but I'll resummarize for convenience.

First we run scripts to tap and install MongoDb
```
brew tap mongodb/brew
brew install mongodb-community@4.0
```

Following installation we run MongoDB in the foreground
```
mongod --config /usr/local/etc/mongod.conf
```

With Mongo now running, you can use the command line any time and whatever code you write that's connected to the database should now run. Start the command line with 
```
mongo
```

Verify it's running. I already have a fetcher db and some collections here.
```
> show dbs
admin    0.000GB
config   0.000GB
local    0.000GB
```

# Import Mongoose
Mongoose is an object modeling tool that helps you interact with your database while in Javascript. It's the equivalent of Sequalize to SQL and helps you execute queries without worrying too much about the query syntax itself.

First we need to install it locally to our project
```
npm install mongoose --save
```

Then in our JS files we import it:
```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/fetcher');
```

Note *mongoose.connect('mongodb://localhost/fetcher')* connects you to a fetcher database, but at this time you would not yet have that database in your system. This is fine. The database will automatically be created when you save your first record.

# Schema design
For this project we'll build a database of books and their respective authors.
```javascript
let BookSchema = mongoose.Schema({
  //Fields
  title: {
    type: String,
    required: true
  },
  published: {
    type: Date,
    default: Date.now
  },
  published: Boolean,

  // Reference
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
  // Subdocuments
  detail: {
    modelNumber: Number,
    reviews: Number
  }
});

let AuthorSchema = mongoose.Schema({
  name: String,
  publisher: String
});

let Book = mongoose.Model('Book', BookSchema);
let Author = mongoose.Model('Author', AuthorSchema);
```

Let's take a moment here to review the code above. First we defined our schemas then we *compiled* our models using those schemas. In the line below, we give the Author model the singular name 'Author'. 
```javascript
let Author = mongoose.Model('Author', AuthorSchema);
```

Mongoose automatically looks for the plural, lowercased name in the database. Therefore, a collection called 'authors' would be created and used in the database. 

In addition, this singular name is what will be used when the Book model has a reference to Author:
```javascript
author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
```

Important note: Running code at this point, Model() will create a copy of schema, so any changes afterwards to the schema may require a deliberate update to schema and model, or a drop of the collection.

# Document creation
## Creating a single document
To create a new document (Mongo's equivalent of a SQL row), we just instantiate a new object, then call its save() function. Save() is asyncronous and returns a promise, so you can either use a then() or an error first callback pattern following its execution.
```javascript
let eric = new Author({
  name: 'Eric',
  publisher: 'Github'
});

// Without a then() or callback function
eric.save(); 

// Using promises
eric.save().then(() => console.log(`Created new author ${eric.name}`));

// Using callbacks
eric.save((err) => {
  if (err) { return console.error(err); }
  console.log(`Created new author ${eric.name}`));
}
```
## Creating multiple documents
Let's say we want to create many documents at one time using an array. Since document creation is async, we need an asycronous function that wraps each individual creation. One option would be to push each promise into an array and run them all with Promise.all().

Luckily Mongoose comes with an insertMany() method, and it works like this:
```javascript
// Without a then() or callbcak
Author.insertMany([eric, tina, john]);

// Using promises
Author.insertMany([eric, tina, john])
.then(() => console.log(`Authors have been added`));

// Using callbacks
Author.insertMany([eric, tina, john], (err) => {
  if (err) { return console.error(err); }
  console.log(`Authors have been added`));
})
```

# Querying collections
Now that we've added some documents, our database should be populated with a fetcher database which has an authors collection and books collection.

We can query for all authors
```javascript
Author.find({})
  .exec((err, data) => {
    if (err) { return console.error(err); }
    console.log(`Authors found:`);
    data.forEach(document => {
      console.log(`${document.name}`);
    });
  })
```

We can query for specific authors
```javascript
Author.find({name: `eric`})
  .exec((err, data) => {
    if (err) { return console.error(err); }
    console.log(`Found ${data.length} users`);
  });
```

# Sending documents
Finally let's put the above together into a response to an API call. Our client might make a GET request to our /authors endpoint, and our server needs to respond with all the authors in our database.

On the client side, the code would look like this:
```javascript
$.ajax({
  url: 'http//localhost:3000/authors',
  method: GET,
  success: (authors) => console.log(`Received ${authors.length} authors`),
  error: () => console.log(`Error retrieving authors`)
});
```

Our server code would require the following route handler and body-parser import:
```javascript
const express = require('express');
let app = express();
var parser = require('body-parser');

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.get('/authors', (req, res) => {
  console.log(`Getting all authors`);
  Author.find({}).
  exec((err, data) => {
    if (err) { retun console.error(err); }
    res.json(data);
  });
});
```

A little side note on res.json(data): 

res.send(data) and res.json(data) are essentially the same if being passed an array or an object, with the primary difference being that res.json() ensures utf8 charset and application/json content-type.