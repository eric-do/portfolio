---
layout: post
title: "Classes, __Proto__ vs Prototype"
comments: true
date: "2019-04-17"
---
![Image](/images/proto_diagram.png)
To understand the different between \_\_proto__ and Prototype, it's important to understand the definitions of terms involved in _Class Inheritence_.

Let's start with **Class**.

A class is a **function** that _creates_ an instance of an object that _conforms_ to the interface _defined_ by the Class **prototype**.

Basically, a class is a factory, like one that creates cars. A factory *creates* cars, but the factory itself generally *does not share the same properties as a car*. For example, a factory has rooms, bathrooms, conveyer belts, and cars have wheels, engines, gas pedals. 

A car factory knows how to build a car through interfaces defined in the factory's **prototype**. For instance, all cars have methods like move() and brake(), which are part of an interface available across all instances of the class. These are implemented through the prototype.

A car factory can create vans, sedans, coupes, trucks, etc. Cars can be customized with color and material, and every car needs a way to move. The implementation of these variables and methods may differ across the cars, but they still share the same interface.

### Pseudoclassical style
Here we define the Car class.
```javascript
var Car (loc, color, material) {
  this.loc = loc;
  this.color = color;
  this.material = material
  this.seats = 4;
}

Car.prototype.move = function() {
  this.loc++;
}
```
Here we create a class called Coupe which inherits properties from Car.
```javascript
var Coupe (loc, color, material) {
  Car.apply(this, arguments);
  this.seats = 2;
}

Coupe.prototype = Object.create(Car.prototype);
Coupe.prototype.constructor = Coupe;
```

### ES6 style
```javascript
class Car {
  constructor() {
    this.loc = loc;
    this.color = color;
    this.material = material;
  }

  move() {
    this.loc++;
  }
}
```
```javascript
class Coupe extends Car {
  constructor() {
    this.seats = 2;
  }
}
```

When looking at the Pseudoclassical style, it's easier to understand what's going on under the hood of classes and subclasses. 

Upon creation of a subclass, the subclass gets a prototype object, which points to the superclass's prototype object. It also gets a \_\_proto__ property, which establishes a delegation relationship between the class and superclass.

### Prototype vs. __proto__
Prototype defines an **interface**, \_\_proto__ defines a **delegation**.

A delegation tells the interpreter where to look when it cannot find a property on an object. The interpreter then checks the object prototype assigned to the current object's \_\_proto__, and returns the value if it's found. If the property is still not found, the interpreter checks *that* object's proto and *continues up the ***prototype chain**** until a property is found, and the corresponding value is returned, otherwise it returns undefined.

Let's build on this with some examples.

#### Objects and arrays
All objects are given a \_\_proto__ object on creation. When we create a Javascript array for instance, the array object does not inherit from any class except the Javascript Array, so when we try to use a method it doesn't have, the object delegates to the Array.prototype.

That sounds confusing, I know. I feel like sometimes you can't explain something in Javascript without repeatedly using the words you're trying to explain.

Let's think about toString(). We call this method on arrays all the time without thinking about it - we just know it's there. How did it get there? We never explicitly defined it, yet our new arrays can use it!

The answer is **delegation.** The intepreter doesn't see a toString() method in our array object, so it looks at the array's \_\_prototype__, which points to Array.prototype. Array.prototype *does* have a toString() method, and this is the method that is called when we use toString() on our array.

```javascript
var arr = [];

arr.__prototype === Array.prototype; // true
```
#### Inheritance
##### Classes
Similar to an array's \_\_proto__ relationship with Array.prototype, instances of a class will have their \_\_proto__ point to the class's prototype.

```javascript
class Car {
  constructor(loc) {
    this.loc = loc;
  }

  move() {
    this.loc++;
  }
};

var bmw = new Car();
bmw.__prototype__ === Car.prototype; // true
```
The new BMW object itself doesn't have a .move() method - it refers to the method accessed from Car.prototype, which is referenced by the BMW's \_\_proto__ object.

##### Subclasses

When you instantiate an object that is an instane of a subclass, the instantiation automatically creates a delegation relationship between the object's class and its superclass.

How does this relationship work?

* \_\_proto__ objects point up a prototype chain to *other \_\_proto__ objects*
* Object prototypes point to \_\_proto__ objects, which allows delegation up the chain when methods aren't found

Here are some quick slides to explain the relationship.
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQw8AwYNGXBH2U1T_FkYFpQj3n7Sf_ROLGEvTPtqGYfNCgXq8HpS0fmyOLdlAVW6WDmFgVLgvRqOSLA/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>