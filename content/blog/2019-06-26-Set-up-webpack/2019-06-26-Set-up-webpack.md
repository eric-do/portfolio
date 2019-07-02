---
layout: post
title: "Setting up Webpack for React"
comments: true
date: "2019-06-26"
---
# Installations
## React
First, we install React and React DOM.
```
npm install --save react react-dom
```

## Webpack
We need to install 3 packages: 
1. Webpack
2. Webpack CLI (required for v4 and up)
3. Webpack HTML plugin - this is not mandatory but I like to get into the habit in case I have templates later I need my index.html to adhere by

We install all these with 
```
npm install --save-dev webpack webpack-cli html-webpack-plugin
```

Sources: 
- [Webpack documentation](https://webpack.js.org/guides/installation/)
## Babel
Next, we'll install Babel. It's important to note Babel had updates in  so some of the older articles you find online may not be correct. 

Also, note as of Babel v7, moved from 'babel' to '@babel', so a lot of the packages you see on articles on the internet will be **wrong**. Also note, Babel has a lot of packages/presets to keep on top of.

You can find a good discussion of the differences [here](https://stackoverflow.com/questions/47721169/babel-vs-babel-core-vs-babel-loader-vs-babel-preset-2015-vs-babel-preset-react-v?rq=1).

We'll be installing:
1. @babel/core @babel/cli @babel/preset-env: allows usage of latet JS
2. @babel/preset-react: compiles JSX
3. babel-loader: enables building with Webpack

```
npm install --save-dev babel-loader @babel/core @babel/cli @babel/preset-env @babel/preset-react
```

Sources
- [Babel usage](https://babeljs.io/docs/en/usage)
- [Babel with React](https://babeljs.io/docs/en/babel-preset-react)

# Configurations
## Webpack
Our objectives are:
- Define a frontend entry point, e.g. index.js
- Set up templating of index.html
- Define a location to put output index.html, e.g. /public/index.html
- Define a bundle filename
- Use babel-loader

With the objectives above in mind, you will have a webpack.config.js file that looks like this:
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const SRC_DIR = path.join(__dirname, '/client');
const DIST_DIR = path.join(__dirname, '/public');

module.exports = {
  entry: `${SRC_DIR}/index.js`,
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Cryptocurrency Chart',
    template: 'index.html'
  })]
}
```

## Babel
For webpack, we just need to state the presets in a .babelrc file:
```javascript
{
  "presets":  ["@babel/preset-env", "@babel/preset-react"]
}
```

## Template for index.html
Finally let's make a template for our index.html file. It will have some variables that reference the options we defined in our webpack.config.js file.
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
```

