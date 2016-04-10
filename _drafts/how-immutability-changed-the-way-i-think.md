---
layout: post
title: "Mutate, or not to mutate, in JavaScript"
permalink: /mutate-or-not-to-mutate/
author: slemgrim
--- 

There are a lot of people out there preaching about immutability as the best solution for everything. 
Others say immutability is nothing for enterprise systems or just a big part of the functional programming hype. 
If we google for it, we'll find tons of opinions and articles describing what immutability is 
In This article we'll focus on the right situations to use it.

The basics
---

Like in a lot of other languages primitives are immutable in JavaScript. This means, whenever we change a primitive,
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

- Cconcurrency <sup>*</sup>
- Save to share instances
- No side effects
- No temporal coupling
- Better readability
- Less memory consumption
- Easy to cache
- Easy to test

<sup>*</sup> Not valid for JavaScript because its neat [Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) 
is non blocking. 

Objects in JavaScript are mutable by default. As soon we use them, we lose all the benefits. But there are multiple ways to 
use them like immutable primitives. 

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

Objects are references, if we avoid changing its properties we will never 
have strange situations where a state is unclear.
Also our finished code will be simpler to understand and easier to test. 

### Avoid setters at all cost. 

This is redundant to the two points above. If we use setters, we change our objects. 

Now that we've heard some points we recognise that it is a lot of tedious work to keep everything immutable. 
This will soon get out of control, so it may be better to get some help. 

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

Although we now lose direct access to objects properties we don't need think about the manual stuff from above.

Bla bla, when should we use it?
---


When to not use it
---

Conclusion
---

With that said, I'm not an enthusiast in this matter. Some problems just don't model nicely when everything is 
immutable. But I do think that we should try to push as much of our code in that direction as possible.
In short: the advantages always depend on the problem, but I would tend to prefer immutability.

