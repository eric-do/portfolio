---
layout: post
title: "Performance analysis: deleting single array elements"
comments: true
date: "2019-04-13"
---
My partner and I came up on the need to delete array elements this last sprint. I thought I'd document a few ways to do so. We tried a couple different methods, and I'm doing a little research to see which is fastest.

To test this, first I establish an array of 10000 elements:
```javascript
var arr = [];
for (var i = 0; i < 10000; i++) {
  arr.push(i);
}
```
**Using splice to mutate array**

You can splice by the index of the given. You should include '1' as the second parameter value to indicate the removal of only one element.

```javascript
arr.splice(arr.indexOf(5000), 1);
```

I ran the code using dev tools and got the following result
```javascript
console.time();
arr.splice(arr.indexOf(5000),1);
console.timeEnd();
VM15047:3 default: 0.023193359375ms
```
So pretty good. 0.023ms to process.

**Using filter to return a new array**

Given the same array, you can filter a new array where values don't match 5000.
```javascript
newArr = arr.filter(function(element) {
  return element !== 5000;
});
```

Here is the code being ran:
```javascript
console.time();
newArr = arr.filter(function(element) {
  return element !== 5000;
});
console.timeEnd();
VM15112:5 default: 0.5341796875ms
```
Much slower 0.534ms to process.

So the lesson here is that it doesn't always pay to have fancy use of array functions :)