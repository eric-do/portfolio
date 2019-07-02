---
layout: post
title: "How to build a React App"
comments: true
date: "2019-04-28"
---
I'm learning React right now, so this is a post about how to do a simple application - setup, simple code.

These are my plans:

- [x] Build MVP for adding/searching to a list in React
- [x] Refactor app to React-Redux (to be shown in a following post)
- [ ] Pull data from API and implement a backend
- [ ] Style app for production aesthetic


## Setup: Dependencies
Babel for ES6 transpilation
 ```
 npm install -g babel-cli
 ```

 Live server to run our code on a live reloading server
 ```
 npm install live-server
 ```

 Then we'll run these and set babel to watch and compile whenever we save.
```
babel . --out-dir compiled --presets=react --ignore=node_modules,compiled --source-maps inline --watch

live-server
```

## Setup: file structure
Then we'll organize our directories and other dependencies.
1. Create folders: src/components, src/data, src/styles
2. Create index files: src/index.js ./index.html
3. Create package.json: make sure to include react, react-dom, jquery, babel, etc
4. Index.html: dependencies like jquery and styles go in the header, component js files go at the end of body

For this example we are going to put our scripts in our HTML, but note that if we were building with webpack, we'd only need to include one script.
```html
<html>
  <head>
    <script src="node_modules/jquery/dist/jquery.js"></script>
    <script src="node_modules/react/dist/react.js"></script>
    <script src="node_modules/react-dom/dist/react-dom.js"></script>
    <script src="node_modules/lodash/lodash.js"></script>
  </head>
  <body>
    <div id="app">
    </div>
    <script type="module" src="compiled/src/components/App.js"></script>
    <script type="module" src="compiled/src/index.js"></script>
  </body>
</html>>
```
Our React components go at the end of our body. It's very important the body loads first, since we attach our app to the app div and want to be sure it loads. Note we don't have to include all our components - just our index.js. We don't want to needlessly import files and cause overhead.

## Index.js
Index.js only needs two things for our basic app:
1. Import App component
2. Redner the App component to the dom

```javascript
import App from './components/App.js';

ReactDOM.render(<App />, document.getElementById('app'));
```

## App.js
### Imports
App.js should import all the components it needs to directly render. For our example, we're importing a movie list, a search field, and a field to add movies. We are also importing our example data.
```javascript
import movies from '../data/exampleData.js';
import MovieList from './MovieList.js';
import Search from './Search.js';
import AddMovie from './AddMovie.js';
```

### Constructor
Our constructor doesn't take any props but we'll set it up to do so anyway, and pass those props to our superclass - React.component.

In the constructor, we'll also set our app's initial state.
```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: movies,
      results: movies,
      found: true
    };
  }

```

### componentDidMount
We don't have a componentDidMount function in this app, but I wanted to mention if we did, it'd be executed immediately following the completion of the constructor function. 

### Add Movie functionality
First we create a handler for when users submit a new movie. The handler should:
* Prevent default form submit action (page reoload)
* Get the title from the input field
* Pass the title to a function to add the movie
```javascript
  addHandler(e) {
    e.preventDefault();
    var title = document.getElementById("add-title").value;
    this.addMovie(title);
  }
```

Then we create a function to process the movie title. It should:
* Create a new movie object
* Get the current movie list from the app's state
* Set the app's movies state to include the new movie - this automatically causes a re-render of the App component
* Also set the app's search result state to be the same as the movies state, since it's assumed we should see all movies again if we were to add while viewing search results
```javascript
  addMovie(title) {
    var newMovie = { title: title };
    var movieList = this.state.movies.concat(newMovie);
    this.setState({
      movies: movieList,
      results: movieList
    });
  }
```

### Search functionality
The search should be ran on submit. First we create a handler for the submit. It should:
* Prevent event default (page reload)
* Get the search query from the input field
* Pass the query to a search function
``` javascript
  searchHandler(e) {
    e.preventDefault();
    var search = document.getElementById("search").value;
    this.searchMovies(search);
  }
  ```

Then we write the search function, which:
* Filters the movies state to create an array containing our search term
* Sets the results state to our filtered array
* Updates the found status (true if our filtered array has one or more movies)

The purpose of the found status is to show/hide the movie list or an error message depending on whether any matches are returned.
```javascript
searchMovies(search) {
    var searchArr = this.state.movies.filter(movie => movie.title.toLowerCase().indexOf(search.toLowerCase()) >= 0);
    this.setState({
      results: searchArr,
      found: searchArr.length > 0 ? true : false
    });
  }
  ```

### Render
Almost there. The App component needs to render its child components as JSX objects, passing in functions and states as props. 
* AddMovie component has a form and will need to receive the addHandler as a prop so it can run function on submit
* Functions that are passed down need _this_ bindings
* Search will need the submitHandler, so it will get that passed down as a prop
* MovieList needs the result state so it knows what to display (search results or all movies), and the found state so it can know whether to show/hide the list
```javascript
render() {
    return (
      <div>
        <div className="navbar">MovieList</div>
        <AddMovie addHandler={this.addHandler.bind(this)} />
        <Search submitHandler={this.searchHandler.bind(this)} />
        <MovieList movies={this.state.results} found={this.state.found} />
      </div>
    );
  }
```

### Export
Lastly in our App component, we need to export the component so our index.js file can import it.
```javascript
export default App;
```

## AddMovie component
Our AddMovie component only has one prop - the addHandler, which it runs onSubmit. We'll create a quick form and include the prop - note it's a function definition and not an invocation. Once we're done with the component, we export it so it can be imported by our App component.
```javascript
var AddMovie = (props) => (
  <form id="add-form" className="add-form" onSubmit={props.addHandler}>
    <input type="text" id="add-title" placeholder="Add movie title here" />
    <input type="submit" value="Add" />
  </form>
);

export default AddMovie;
```

## MovieList component
Our MovieList component needs to import the MovieEntry component, since it will display an array of MovieEntry components. It will also pass a movie object to each MovieEntry as a prop.

**Be careful** about one line statements using multiple lines, like with map()! This is okay to do and the multiple lines can be wrapped in parenthesis, but I've screwed up many times not noticing I used curly braces instead, so I wasn't returning anything.

We also will include some styling logic to show/hide the movie list. Note that style is written as an object, rather than a string of key/value pairs. Attribute names are camelCase rather than snake-case.


```javascript
import MovieEntry from './MovieEntry.js';

var MovieList = (props) => (
  <div>
    <div id="movie-list" className="movie-list" style={props.found === false ? {display: "none"} : {}}>
      {
        props.movies.map(movie => (
          <MovieEntry key={movie.title.toString()} movie={movie}  />
        )) 
      }
    </div>
    <div id="no-results" style={props.found === true ? {display: "none"} : {}}>
      No movie by that name found
    </div>
  </div>
);

export default MovieList;
```

## MovieEntry component
This component doesn't need to import anything. It displays the movie title from the movie object prop it was passed from MovieList.

```javascript
var MovieEntry = (props) => (
  <div className="movie-entry" className="movie-entry">{props.movie.title}</div>
);

export default MovieEntry;
```

## Search component
Finally we get to our Search component, which of course, executes a search.

There's no magic here except to call the submitHandler onSubmit. As usual we export the component.
```javascript
var Search = (props) => (
  <div>
    <form onSubmit={props.submitHandler}>
      <input type="text" className="search" id="search" placeholder="Search..." />
      <input type="submit" className="submit-search" value="Go!" id="submit"/>
    </form>
  </div>
);

export default Search;
```

And that's it! With that done we have an MVP movie list search app.

![image](/images/movieList1.png)

Future iterations will use redux, APIs, and more!
