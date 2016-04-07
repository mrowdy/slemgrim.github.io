---
layout: post
title: "Immutabilty makes you win at everything"
permalink: /how-immutability-changed-the-way-i-think/
author: slemgrim
--- 

The majority of my developer was about objects, passing objects around and 
changing them. Be it Java, PHP or JavaScript, when you start to learn a 
language you soon learn the concepts of pointers, references and instances. 
You start to love them, using them everywhere. Nothing is wrong with that, 
Why should someone pass complex multidimensional arrays around if they could 
abstract it to simple composed objects. 

{{Comparison between multidimensional arrays and objects}}

Nothing is wrong with that at all. But there a different ways to work with Objects
and today we'll talk about immutability. 

What is immutability?
---

The first time i heard "Strings are immutable" was years ago while learning java.
For me this didn't made any sense at that time since google says: 

> **Immutable**: unchanging over time or unable to be changed. 

I can change a string, so how can it be immutable? 

```js
// lets define a string in JS
let foo = 'bar'; 
// now lets change it. 
foo = 'baz';
console.log(foo); // results in baz
``` 

String changed. String not immutable. Simple. **WRONG!**

Of course this is wrong. The above code doesn't change the string 'bar' to 'baz', 
instead it created a new string with the value 'baz'. But why is this?

All primitives in JavaScript are Immutable
---

It doesn't matter if its a number a string or a boolean, the behaviour is the same for all primitives. 
Since this is also true for many other languages like Python, Java or #C this must have a benefit. In fact
there are a lot of benefits. 

### Concurency

In most resources this is the number one benefit, but not for JavaScript. The idea is, that you don't have 
to lock something that isn't changeable. JavaScript with it's neat 
[Even Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) is never blocking, so there are no 
situations where concurency is a problem. 

### Security

Mutable objects can be changed at any time, even when you don't expect it. 
This can lead to strange and heavy to find bugs

```js
let name = 'Slemgrim';
let person = {
    firstname: name;
}

name = 'mirgmelS';
console.log(person.firstname) // 'Slemgrim'
```

Imagine what would happen if the string used in the persons firstname could be changed without touching the object.
You are right: **hell would break lose**. Nothing would be save anymore, our code would be a battlefield where everything
can change your string without you even noticing.
 
Luckily strings are mutable and the object has only a copy of the initial string 

### Memory Consumption

Multiple used primitives point to the same instance inside the memory. This not only reduces memory consumption but also
makes primitives save to share and improves cache utilisation.

### Performance



