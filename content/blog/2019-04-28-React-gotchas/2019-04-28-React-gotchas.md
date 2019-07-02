---
layout: post
title: "React Gotchas"
comments: true
date: "2019-04-28"
---
These are some of the mistakes I found myself making more than once while building my first React app. If I write them down I'm less likely to make them again :)

### Class names
React requires 'className' rather than 'class' for HTML tags.
```
 <div className="navbar">MovieList</div>
```

### HTML tags
Tags should be closed off JSX style if they do not have a corresponding separate closing tag.
```javascript
 <input type="submit" value="Go!" className="submit" />
```

### Event handlers
Event handlers require function definitions, not function invokations.
```javascript
<input type="submit" value="Go!" className="submit" onClick={(e) => props.submitHandler(e)}/>
```

Also, what's the difference between the line above and this one? Both produce the same event in submitHandler:
```javascript
<input type="submit" value="Go!" className="submit" onClick={props.submitHandler}/>
```

Event handlers must be passed down as props, referencing **this**.
```javascript
 <Search submitHandler={this.submitHandler.bind(this)}/>
```
### Inline styles
Inline styles are not done in HTML style. Differences:
* Style is an object rather than a string of key/value pairs
* Attributes should be camelCase rather than snake-case
* Values are strings

```javascript
<div id="no-results" style={props.found === true ? {display: "none"} : {}}>
```

### Exports
* Make sure component files are being exported
* Make sure component files are being imported **and** using the intended import name

### Using brackets in one liners

```javascript
{
  props.movies.map(movie => {
    <MovieEntry movie={movie} />
  }) 
}
```

instead of

```javascript
{
  props.movies.map(movie => (
    <MovieEntry movie={movie} />
  )) 
}
```