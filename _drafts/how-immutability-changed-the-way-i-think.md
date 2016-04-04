---
layout: post
title: "How immutability changed the way i thinl"
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

The first time i heard this was years ago and was something like this: "Strings are immutable".
For me this didn't made any sense since google says: 

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
