---
layout: post
title: "Mutate, or not to mutate, in JavaScript"
permalink: /mutate-or-not-to-mutate/
author: slemgrim
--- 

There are a lot of people out there preaching about immutability as the best solution for everything. 
Others say immutability is nothing for enterprise systems or just a big part of the functional programming hype. 
If we google it, we'll find tons of opinions and articles describing what immutability is. 
In This article we'll focus on the right situations to use it in JavaScript.

The basics
---

Like in a lot of other languages, primitives are immutable in JavaScript. This means whenever we change a primitive,
we create a new instance of it. 

```js
// Strings
let str = "Hello world!";
let res = str.slice(1,5); //ello

// Numbers
let number = 10;
number += 15;
```

This comes with a bunch of benefits:

- ~~Concurrency~~
- Save to share instances
- No side effects
- No temporal coupling
- Better readability
- Less memory consumption
- Easy to cache
- Easy to test

There are pure functional languages like ELM and Haskell where it isn't possible to mutate any value. JavaScript isn't 
one of them. Objects in JavaScript are mutable by default. As soon we use them, we lose all the above benefits. 
But there are multiple ways to use them like immutable primitives. 

The manual way
---

Although JavaScript doesn't have support for immutable objects, we still can write our code in a way that 
doesn't use any form of mutation.

### Don't change objects in functions

Write function that return altered copies instead of changing properties of the given object. 

```js
//bad
function save(object){
    object.saved = true;
    return object;
}

//better
function save(object){
    let newObject = object.save(true);
    return newObject;
}
```

In this case ```object.save()``` returns a new instance of the object. We can use ```Object.assign``` to clone 
the original instance, implement a deep clone method or use existing libraries. 
 
#### Do not change objects after construction. 

```js
let request = {
    method: "GET",
    uri: "http://slemgrim.com"
}

// don't do this
request.method = "POST"
```

Objects are references, if we avoid changing its properties we avoid situation of unclear state.
Also our finished code will be simpler to understand and easier to test. 

### Avoid setters at all cost. 

This is redundant to the two points above. If we use setters, we change our objects. So we don't use setters.  

Looks like a lot of tedious work to avoid mutation. The fact that JavaScript doesn't have built in support for immutable
objects makes it really hard for us. Time to get some help. 

### Immutable.js

Facebook's [Immutable.js](https://facebook.github.io/immutable-js/) is a small library which helps us to keep our state immutable.
There are other libraries which work in a similar way ([Mori](https://github.com/swannodette/mori), 
[seamless-immutable](https://github.com/rtfeldman/seamless-immutable)), but for this article we stick to immutable.js.

I will not go into detail because their [documentation](https://facebook.github.io/immutable-js/) is really simple. but to wrap it up:

> Immutable.js provides many persistent immutable data structures including: 
> ```List, Stack, Map, OrderedMap, Set, OrderedSet and Record```

Or in form of code:

```js
import Map from 'immutable';
var request = Map({method: 'GET', uri: 'http://slemgrim.com'});
var post = request.set('method', 'POST');
request.get('method'); // GET
post.get('method'); // POST
```

Although we now lose direct access to objects properties we no can focus on our goals instead of fighting against mutability.

Bla bla, when should we use it?
---

### Concurrency

This is the number one reason for immutability. You don't have to lock something if it doesn't change. In JS there
is no real concurrency. Instead we have an [Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). 

### To avoid side effects.

Changing properties of objects is Mutation. Mutation is by definition a side effect. Everyone of us learned that
wy should avoid side effects at all cost. We don't have to look into the implementation of a function if it doesn't have
any side effects. Our code gets easier to reason about and will be more predictable and more testable. 

Imagine your address book filled with email addresses. What if someone gets a new email and abandons his old one,
or what if it isn't your affair responding to your email, but her partner? All side effects. All avoidable. 

### With functional Programming

There are times where you have to stop and think about whether you're dealing with a value or a reference. Immutable 
objects are always values. This is one of the core principles of functional programming. If i pass a value to a function
i can promise it stays forever the same.


When to not use it
---

### Often changing properties

If you have objects that change really often, it isn't the best idea to create a new instance for every change.
This is especially true for games and simulations where this happens multiple times a second. I don't say you can't use
immutability in games but it's way easier to fall into performance issues than with mutable objects. 

### Huge data structures

If you have a really huge tree of data stored as an immutable container i recommend checking your memory consumption. 
Garbage collection will kill all old objects but copying big objects comes with its price.

Conclusion
---

Some problems just don't model nicely when everything is immutable. 
But I do think that we should try to push as much of our code in that direction as possible.
In short: the advantages always depend on the problem, but I would tend to prefer immutability.

