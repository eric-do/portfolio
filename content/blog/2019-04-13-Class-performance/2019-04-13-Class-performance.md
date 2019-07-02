---
layout: post
title: "Functional Class instantion vs. ES6 Class instantion performance"
comments: true
date: "2019-04-13"
published: false
---
There are 5 different instantiation patterns:
1. Functional
2. Functional shared
3. Prototypal
4. Pseudoclassical
5. ES6

I'm going to use this post to document the performance between each, using stacks and queues. Maybe other data structures later.

## ES6
1010.6 ms pop

## Functional
1942.3 ms Stack.someInstance.pop