---
layout: post
title: "To mutate, or not to mutate, in JavaScript"
permalink: /mutate-or-not-to-mutate/
author: slemgrim
--- 

There are a lot of people out there preaching about immutability as the best solution for everything. 
Others say immutability is nothing for enterprise systems or just a big part of the functional programming hype. 
If we google it, we'll find tons of opinions and articles describing what immutability is. 
In this article we'll focus on the right situations to use it in JavaScript.

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
one of them. Objects in JavaScript are mutable by default. As soon as we use them, we lose all the benefits above. 
But there are multiple ways to use them like immutable primitives. 

The manual way
---

Although JavaScript doesn't have support for immutable objects, we still can write our code in a way that 
avoids most mutations.

### Don't change objects in functions

Write functions that return altered copies instead of changing properties of the given object. 

```js
//bad
function save(object){
    object.saved = true;
    return object;
}

//better
function save(object){
    let newObject = object.clone();
    newObject.saved = true;
    return newObject;
}
```
 
### Do not change objects after construction. 

Objects are references, if we avoid changing their properties we avoid situation of unclear state.
Also our finished code will be simpler to understand and easier to test. 

```js
let request = {
    method: "GET",
    uri: "http://slemgrim.com"
}

// don't do this
request.method = "POST"
```

### Avoid setters at all cost. 

This is redundant to the two points above. If we use setters, we change our objects. So we better not use setters.  

Looks like a lot of tedious work to avoid mutation. The fact that JavaScript hasn't got a built in support for immutable
objects makes it really hard for us. Time to get some help. 

Immutable.js
---

Facebook's [Immutable.js](https://facebook.github.io/immutable-js/) is a small library which helps us to keep our state immutable.
There are other libraries which work in a similar way ([Mori](https://github.com/swannodette/mori), 
[seamless-immutable](https://github.com/rtfeldman/seamless-immutable)), but for this article we stick to Immutable.js.

I will not go into detail because it's [documentation](https://facebook.github.io/immutable-js/) is really simple, but to wrap it up:

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

Although we lose direct access to object properties, we now can focus on our goals instead of fighting against mutations.

Bla bla, when should we use it?
---


ESLint Immutable
---

There's also the [eslint-plugin-immutable](https://github.com/jhusain/eslint-plugin-immutable) plugin which disables 
all mutation in JavaScript. The readme mentions react/redux a lot, but you can safely use the plugin without the two.

### The plugin adds three rules:

- no-let: use const instead of let.
- no-this: prohibits this and therefore ES6 classes.
- no-mutation: prohibits assigning a value to the result of member expressions.

**thx to [@thisisgordon](https://k94n.com/) for the hint**

### Concurrency

This is the number one reason where immutability makes sense. In order to be thread-safe you don't have to lock something
that doesn't change. In JS there is no real concurrency. Instead we have an 
[Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). So forget about this. 

### To avoid side effects.

Changing properties of objects is mutation. Mutation is a side effect by definition. Everyone of us learned that
we should avoid side effects at all cost. We don't have to look into the implementation of a function if it doesn't have
any side effects. Our code gets easier to reason about and will be more predictable and more testable. 

### With functional programming

There are times where you have to stop and think about whether you're dealing with a value or a reference. Immutable 
objects are always values. This is one of the core principles of functional programming. If I pass a value to a function
I can promise it stays the same forever.

When to not use it
---

### Often changing properties

If you have objects that change really often, it isn't the best idea to create a new instance for every change.
This is especially true for games and simulations where this happens multiple times a second. I'm not saying you can't use
immutability in games, but it's way easier to fall into performance issues than with mutable objects. 

### Huge data structures

If you have a really huge tree of data stored as an immutable container I recommend checking your memory consumption. 
Of course garbage collection will kill all old objects but copying big objects still has its price. 

Conclusion
---

In general it's a pretty reasonable language design choice to stick to immutable types, even it there are some problems
that just don't model nicely when everything is immutable. 
In most situations the advantages of immutable types vastly outweigh the disadvantages and they are better than the
alternatives and lead to better code and faster executables overall.