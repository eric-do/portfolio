---
layout: post
title: "Quick setup for Mocha and Babel with ES6"
comments: true
date: "2019-09-22"
---

## Purpose
I never seem to be able to set Babel and Mocha with ES6 in a reasonable amount of time. I'm documenting the bare minimum to get them set up here.

## Steps
### Install packages
 - Babel
 - Chai
 - Mocha

```
npm install --save-dev @babel/cli @babel/core @babel/node @babel/register @babel/preset-env chai mocha
```

### package.json
In package.json, update the test script:
```
 "scripts": {
    "test": "mocha --require @babel/register"
  },
```

### babal.rc
In .babelrc, update presets:
```
{
  "presets": ["@babel/preset-env"]
}
```