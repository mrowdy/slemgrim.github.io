---
layout: post
title: "All you need to know about server push"
permalink: /all-you-need-to-know-about-server-push/
date: 2016-03-10 08:00:00 +0000
author: slemgrim
---

I bet you heard about server push in the last few months. 
Every HTTP/2 article mentions it, but do you really know what it's all about?
The intention of this article is to give you a kick-start into the topic.

Why do we need server push?
---

To answer that question we have to look at how HTTP/1.x works. 
The "internet" consists of resources which are linked together. 
Take your standard web-page, it consists of a HTML file various 
stylesheets, scripts, images and other assets.

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="assets/css/app.css" type="text/css">
</head>
<body>
    <script src="assets/js/app.js"></script>
    <script src="assets/js/index.js"></script>
</body>
</html>
```

So when we request a website your browser first loads a html file, 
looks for all assets inside it, and requests each asset at it's own. 
Every asset can than require other assets at its own. Think about background 
images in your stylesheets or scripts loaded with AJAX.

![http1.x asset waterfall][http1.x-asset-waterfall]

You clearly see that the browser needs to download the HTML file before the other assets.
There's also a lot of time spend on connection to the single resources. 

With HTTP/2 and it's [multiplexed connections](https://http2.github.io/faq/#why-is-http2-multiplexed) the browser doesn't have
to make multiple connections. It keeps the first connection open and downloads all assets from this 
domain over it.
 
![HTTP/2 asset waterfall][http2-asset-waterfall]

In reality it does a lot more things but for the scope of the article this should do it.
We now save a lot of overhead especially when we have many assets. 
With this feature we eliminate common hacks like script/style concatenation, spriting and domain sharding at 
protocol level. Pretty rad. 

There are still big time steps in the waterfall. We know which files are required by our HTML file so wy can't we send
them at once? We already do this. I'ts called inlining.

### Whats the problem with inlining?

In order to be performant we came up with a list of hacks in the past. One is asset inlining. You see it in various forms:

![inlining of assets][asset-inlining]

- Stylesheets are inlined for [Critical above the fold CSS](http://patrickhamann.com/workshops/performance/tasks/2_Critical_Path/2_2.html)
- Scripts are inlined for "performance" *rolleyes*
- Images are inlined as base64 to avoid further requests
- SVG icons are inlined mainly to spare developer time

But that comes whit two huge disatvantages:

#### Caching 

Browsers are really good at caching. If you have some shared styles/scripts across your website,
the browser will cache it at the first time of download. All further requests don't need to be downloaded. 
When inlined, it will be downloaded every time the user requests a page. 

Let's say you have a CSS file of 50kb. If it is cacheable the user has to download 50kb once. Even if he opens hundreds of pages on your site.
If it's inline the user downloads 5000kb of css when he opens 100 pages. Think about popular news sites, you open them
every day and read lots of articles. 

#### Complexity

When you inline, you have to decide what needs to be inlined. Which part of your CSS, which JS modules?
Do i inline all icons on every page, or just the one i need on this page? 
This introduces an extra layer of complexity to your application. 

HTTP/2 server push to the rescue
---

With server push we can "push" assets like scripts,styles and images along with the requested file. 
So if index.html requires index.js it is already loaded. no further requests needed. 

> Hey browser, i think you'll need app.css and app.js along with your requested index.html, so i'll send them too

Our waterfall now looks like this:

![HTTP/2 push waterfall][HTTP/2-push-waterfall]

Your browser doesn't request the assets anymore. Now the server has control over which files are sent to the browser.
Every file exists at it's one. Not concatenated, not inlined. So the browser **can** cache them. 

<div class="message message--warning">
   Be careful here. The server doesn't know which files are already cached by the browser. 
   When a browser receives a pushed file which he already has in cache, he can ignore it, but the file still would be sent
   over the wire. Resulting in extra overhead similar to inlined assets. 
</div>

Which files to push?
---

Now to the complicated part. Which files should we push?
There are multiple approaches to this:

### Analyzing requested files

When a file is requests, we can analyze it for further requests. 
A HTML file for example has script, link, img and other tags which point to other resources.

- relatively simple to implement
- but it doesn't really make sense to push everything
- this wouldn't find indirect assets like images requests from css files or scripts loaded by scripts 

### Static list

Instead of analyzing we could provide a list of resources to be pushed

```
- index.html
    - app.css
    - app.js
    - index.js
    - bg.jpg
- contact.html
    - app.css
    - app.js
    - contact.js
    - bg.jpg
```

- free control about what files are pushed 
- harder to maintain
     
Implementations
---

### Apache

The experimental [mod_http2 Apache Module](https://httpd.apache.org/docs/2.4/mod/mod_http2.html) introduces
the [H2Push Directive](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2push) which toggles the usage of the HTTP/2
server push protocol feature and is used your <VirtualHost> section. 

They detect a push by **Link** entries inside the response headers 
([mod_headers](https://httpd.apache.org/docs/2.4/mod/mod_headers.html)).

``` xml
<Location /index.html>
    Header add Link "</assets/css/app.css>;rel=preload"
    Header add Link "</assets/js/app.js>;rel=preload"
</Location>
```

There's also the [H2PushDiarySize Directive](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2pushdiarysize) 
which basically remembers which files are already pushed on a connection. This avoids duplicated files on single
connections.

And the [H2PushPriority Directive](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2pushpriority) which handles the 
[prioritizing]() of single pushes.

### Node

[node-http2](https://github.com/molnarg/node-http2) is a HTTP/2 implementation with an quite simple and similar API
to the standard node.js HTTP extension.

``` js
function onRequest(request, response) {
    var filename = path.join(__dirname, request.url);
    
    // Only if response has the ability to push
    if(response.push){
        var fileToPush = '/assets/css/app.css';
        
        //Get a push object from the response
        var push = response.push(fileToPush);
        
        //Write HTTP status code for the push
        push.writeHead(200);
        
        //Create read stream and pipe to the push object
        fs.createReadStream(path.join(__dirname, fileToPush))
        .pipe(push);
    }
    
    response.writeHead(200);
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(response);
    fileStream.on('finish', response.end);
}; 
   
I created my examples with this. 
Todo: include gist?
   
```

### Push Manifest

[http2-push-manifest](https://github.com/GoogleChrome/http2-push-manifest) generates a list of static resources 
used in your html files by outputting a json file. 
This file can be used to create the [Link](#todo) headers alongside with type and weight. You can even use this in App Engine

The usage is as simple as: 
    
    $ http2-push-manifest -f index.html

which generates:

```
{
  "/assets/css/app.css": {
    "type": "style",
    "weight": 1
  },
  "assets/js/app.js": {
    "type": "script",
    "weight": 1
  }
}
``` 

Push priority
---

TODO: more text
There are different approaches on how to prioritzize 
[great explanation by Moto Ishizawa](https://speakerdeck.com/summerwind/2-prioritization)


Debugging Server Push
---

When you first implement server push you have to check if it works.
Unfortunately there isn't something like a dedicated "pushed resource" sign in your dev tools. 
But if you go to the timing tab of a resource you'll see that it has almost no <abbr title="Time to first byte">TTFB</abbr>:

![dev tools timing with push][push-example-push]

Compared to a normal http request:

![dev tools timing without push][push-example-no-push]

If you really need to see whats going on you can peak into `chrome://net-internals/#events`

Search for **PUSH_PROMISE** and you'll see your pushed assets.

![HTTP/2 server push visible inside net-internals][push-promise]

What does this mean to our beloved tooling like webpack?
---

???

Browser Support
---

Every browser that supports HTTP/2 also supports server push. But they differ in how to 
handle prioritization with weight and priority

<p class="ciu_embed" data-feature="http2" data-periods="future_1,current,past_1,past_2">   <a href="http://caniuse.com/#feat=http2">Can I Use http2?</a> Data on support for the http2 feature across the major browsers from caniuse.com. </p>

Further reading
---
- [Deploying JavaScript Applications with HTTP/2](https://rmurphey.com/blog/2015/11/25/building-for-http2)
- [Explanation of server push in mod_http2](https://icing.github.io/mod_h2/push.html)
- [Understanding HTTP/2 priorization](https://speakerdeck.com/summerwind/2-prioritization)
- [HTTP/2 Frequently Asked Questions](https://http2.github.io/faq/)

[http1.x-asset-waterfall]: /images/http1-waterfall.png
[http2-asset-waterfall]: /images/http2-waterfall.png
[asset-inlining]: /images/inlining.png
[http2-push-waterfall]: /images/http2-push-waterfall.png
[push-example-push]: /images/pusxh-example-pushed.jpg
[push-example-no-push]: /images/push-example-not-pushed.jpg
[push-promise]: /images/push-promise.jpg

---

Notes
===

- is not a generic push mechanism like websockets 
- it's designed for optimisation of HTTP/2 conversations
- server can guess associated resources for a given resource

With HTTP/2 a connection can serve multiple requests simultaneously. 

HTTP/2 push replaces this at the protocol level. Yes this means no more inlining and concatenation, in fact this practice is harmful.

So is it ok to have multiple **script** and **link** tags in our documents? I know, we spent the last years to avoid this, but
now this comes with a couple of benefits

## type property

## weight property

Weight in HTTP/2 is a value used for distributing bandwidth between the streams. 
In case of CSS or JavaScript files, what you should do is to assign bandwidth exclusively to those files     
    
Todo: what is type? Why is it necessary?
Todo: what is weight? Why is it necessary? 

At the moment of writing no browser implements handling of the weight property. 