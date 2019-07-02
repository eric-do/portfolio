---
layout: post
title: "Changing object references"
date: "2019-04-08"
comments: true
---

Consider the example below. It would be intuitive to think that when we change the value of obj.inner, *example* is affected. However this is not the case.
```javascript
var obj = { 
  inner: { x: 10 }
};
var example = obj.inner;
obj.inner   = undefined;
```
What's happening here:
1. An object is defined with key 'inner', which points to another object, { x:10 }
2. *var example* points to the **object** that is pointed to by *obj.inner*
Note: this does NOT mean there now exists a relationship/binding between *example* and *obj.inner*
3. The value of obj.inner is changed to undefined
Note: the *previous* object that obj.inner pointed to ({ x:10 }) still exists, and *example* remains pointing to it
4. The value of example is then { x: 10 }, **not** undefined

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTRlW6184MQ9BOT4sGPgrKRLFyUQiIeNUE6uB9J_CeeToBBlPVwaN_XCS9xHwqt5tZqX8IVcpy9EWVO/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

Some more code that may be confusing is below. Once we define player to be undefined, we might think back in the global scope player is now also undefined, however, its score value has been mutated, but its object reference remains in place due to scope.
```javascript
var player = { score : 4 };

var updateScore = function(player) {
    player.score = 2;
    player = undefined;
}

updateScore(player);
```