---
layout: post
date: "2019-04-02"
title: Iterators
comments: true
---

An iterator is a function applied to each element of a collection as we *iterate* the collection.

Typically the iterator is defined outside a given function, and passed to the function as a parameter. This keeps the iterator and the function/collection blind to each other's implementation.

For instance, we may have a function called *processNumbers(iterator, a, b)*.

```javascript
function processNumbers(iterator, array) {
  return array.map(function(value){
      return iterator(value);
  });
}
```

This function is blind as to how it processes numbers. It only takes accepts the iterator as a function to process the numbers, and itself does not define how the numbers are processed.

Now we define some iterating functions:

```javascript
function double(val) {
    return val * 2;
}

function half(val) {
    return val / 2;
}
```

Now we can process an array passing in the function of our choice as an iterator:

```javascript
var array = [2, 4, 6, 8, 10];
var doubleArray = processNumbers(double, array);
var halfArray = processNumbers(half, array);

console.log(doubleArray);   //[4, 8, 12, 16, 20]
console.log(halfArray);     //[1, 2, 3, 4, 5]
```

## Why do we use iterators?

We can easily change the code of the list implementation without needing to touch the code where the list is being iterated. This make the code more reliable and extensible.

Function A might require information from Function B in the form of a list, but it has no need to know how that list is created. 

It's like a Product Manager asking a Web Developer for a new website. The PM passes the request but should not be overly concerned with the techical implementation :)