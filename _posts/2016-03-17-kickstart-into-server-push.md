---
layout: post
title: "A kick-start into server push"
permalink: /kickstart-into-server-push/
date: 2016-03-17 20:00:00 +0000
author: slemgrim
--- 

I bet you heard about server push in the last few months. 
Every HTTP/2 article mentions it, but do you really know what it's all about?
The intention of this article is to give you a kick-start into the topic.

Why do we need server push?
---

To answer that question we have to look at how HTTP/1.x works. 
The "internet" consists of resources which are linked together. 
Take your standard web-page, it consists of a HTML file, various 
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

When we request a website your browser first loads a HTML file, 
looks for all assets inside it, and requests each asset at its own. 
Every asset can then require other assets at its own. Think about background 
images in your stylesheets or scripts loaded with AJAX.

![http1.x asset waterfall][http1.x-asset-waterfall]

You clearly see that the browser needs to download the HTML file before the other assets.
There's also a lot of time spent connecting to the single resources. 

With HTTP/2 and its [multiplexed connections](https://http2.github.io/faq/#why-is-http2-multiplexed) the browser doesn't have
to make multiple connections. It keeps the first connection open and downloads all assets from this 
domain over it.
 
![HTTP/2 asset waterfall][http2-asset-waterfall]

In reality it does a lot more but for the scope of the article this should do.
We now save a lot of overhead, especially when we have many assets. 
With this feature we eliminate common hacks like script/style concatenation, spriting and domain sharding at 
protocol level. Pretty rad. 

There are still big time steps in the waterfall. We know which files are required by our HTML file so why can't we send
them at once? We already do this. It's called inlining.

### Whats the problem with inlining?

Nowadays you see developers inlining every kind of asset. While there are some more or less useful strategies like 
"[Critical above the fold CSS](http://patrickhamann.com/workshops/performance/tasks/2_Critical_Path/2_2.html)", there 
are also really cruel ones like base64 images inside css files.

![inlining of assets][asset-inlining]

In the end you will do this to avoid requests and get everything you need in one single request.
This may look nice, but also introduces some new problems. 

- Browsers are really good at caching. If assets are inlined, they don't get cached. 
- What files should we inline? Which part of the css? Voila, a new layer of complexity 
- base64 encoded images are way bigger than their source file. 

HTTP/2 server push to the rescue
---

Server push allows a server to send request+response pairs to the browser. If the browser requests `/index.html`,
and the server knows that `/index.html` contains a reference to `/app.css` and `/app.js` the server now can
push both files rather than waiting for the browser to request it.

> Hey browser, I think you'll need app.css and app.js along with your requested index.html, so I'll send them too.

![HTTP/2 push waterfall][http2-push-waterfall]

Compared to the inlining example we now can download all assets parallel, while delivering separate files which 
can be cached by the browser.


Push promise
---

To push a response to the browser the server opens a stream using a so called [`PUSH_PROMISE`](http://httpwg.org/specs/rfc7540.html#PUSH_PROMISE) frame, which
let the browser know exactly which resources are getting pushed. A `PUSH_PROMISE` is associated with a normal request, 
so that the browser knows which push belongs to which request.


Canceling of push streams
---

If a browser already has a resource cached he can send a [`RST_STREAM`](http://httpwg.org/specs/rfc7540.html#RST_STREAM) frame 
to tell the server he wants to cancel an incoming push. 
The `RST_STREAM` frame immediately closes a stream.

<div class="message message--warning">
   Be careful here. The server doesn't know which files are already cached by the browser. Every pushed resource
   is a GET and therefore cacheable, this could lead to a lot of overhead if you push every asset on every request. Even if the browser sends a
   RST_STREAM frame.
</div>
 
Which files to push?
---

For me, this is the most complicated part. Can we push everything? As mentioned earlier this would lead to 
a waste of bandwidth and server resources. So choose wisely what files you push.
I found two different ways to accomplish this.

### Analyzing requested files

When a file is requests, we can search for requested assets and push them.
A HTML file for example has `<script>`, `<link>`, `<img>` and other tags which point to other resources.

- relatively simple to implement
- but it doesn't really make sense to push everything
- it's also hard to find indirect dependencies like background images defined in css. 

### Static push list

Instead of analyzing, we could provide a list of resources which we want to push. So wenn a file is request, we look
into our list if we have something to push. Such a list could look something like this:

``` json
{
    "index.html" : [
        "app.css",
        "app.js",
        "bg.jpg"
    ],
    "contact.html" : [
        "app.css",
        "contact.js",
    ]
}    
```

- free control over your pushes
- harder to maintain

[http2-push-manifest](https://github.com/GoogleChrome/http2-push-manifest) does a really good job in generating such lists
from HTML files.
     
Implementations
---

### Apache

The experimental [mod_http2](https://httpd.apache.org/docs/2.4/mod/mod_http2.html) apache module introduces
the [H2Push Directive](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2push) which toggles the usage of the HTTP/2
server push protocol feature and is used in your <VirtualHost> section. 

You have to write all your pushes as `Link` entries inside the response [headers](https://httpd.apache.org/docs/2.4/mod/mod_headers.html).

``` xml
<Location /index.html>
    Header add Link "</assets/css/app.css>;rel=preload"
    Header add Link "</assets/js/app.js>;rel=preload"
</Location>
```

- [H2PushDiarySize Directive](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2pushdiarysize) basically remembers
which files are already pushed on a connection to avoid redundant pushes.

- [H2PushPriority Directive](https://httpd.apache.org/docs/2.4/mod/mod_http2.html#h2pushpriority) handles the 
priority of single pushes.

### Node

[node-http2](https://github.com/molnarg/node-http2) is a HTTP/2 implementation with a similar API
to the standard node.js HTTP extension.

``` js
function onRequest(request, response) {
    var filename = path.join(__dirname, request.url);
    
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
      
```

They also have [examples](https://github.com/molnarg/node-http2/tree/master/example).

### Push Manifest

[http2-push-manifest](https://github.com/GoogleChrome/http2-push-manifest) generates a list of static resources 
used in your HTML files by outputting a json file. 
This file can be used to create the [Link](#todo) headers for apache. You can even use this in App Engine.

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

You can use the json for you custom push implementation or even on App Engine.

### NGINX

There is a [experimental HTTP/2 Module](http://nginx.org/en/docs/http/ngx_http_v2_module.html)
but **without** an implementation of server push. The same goes for NGINX plus.
I'll keep you updated on this.

### Go

Server push is possible with the official [HTTP/2 package](https://godoc.org/golang.org/x/net/http2).
I'll provide an example in the future.

Debugging Server Push
---

When you first implement server push you have to check if it works.
Unfortunately there isn't something like a dedicated "pushed resources" button in your dev-tools. 
If you go to the timing tab in chrome dev-tools of a resource you'll see that it has almost no <abbr title="Time to first byte">TTFB</abbr> 
and the download time is way lower (altough 'Content Download' sounds misleading here).

![dev tools timing with push][push-example-push]

Compared to a normal http request:

![dev tools timing without push][push-example-no-push]

If you really need to see whats going on you can peak into `chrome://net-internals/#events`

Search for `PUSH_PROMISE` and you'll see your pushed assets.

![HTTP/2 server push visible inside net-internals][push-promise]


Browser Support
---

Every browser that supports HTTP/2 also supports server push. But they differ in how to 
handle prioritization with weight and priority.

<p class="ciu_embed" data-feature="http2" data-periods="future_1,current,past_1,past_2">   <a href="http://caniuse.com/#feat=http2">Can I Use http2?</a> Data on support for the http2 feature across the major browsers from caniuse.com. </p>

TL;DR
---

At the moment of writing there's only an experimental implementation of server push for
apache and no implementation for NGINX. If you really want to push, you can start with [node-http2](https://github.com/molnarg/node-http2) or 
[HTTP/2 for Go](https://godoc.org/golang.org/x/net/http2). 

Keep in mind that it can be much overhead if you push a lot of files. Especially if those files are 
already cached by the browser.

Further reading
---

- [List of known HTTP/2 implementations](https://github.com/http2/http2-spec/wiki/Implementations)
- [Deploying JavaScript Applications with HTTP/2](https://rmurphey.com/blog/2015/11/25/building-for-http2)
- [Explanation of server push in mod_http2](https://icing.github.io/mod_h2/push.html)
- [Understanding HTTP/2 priorization](https://speakerdeck.com/summerwind/2-prioritization)
- [HTTP/2 Frequently Asked Questions](https://http2.github.io/faq/)

[http1.x-asset-waterfall]: /images/http1-waterfall.png
[http2-asset-waterfall]: /images/http2-waterfall.png
[asset-inlining]: /images/inlining.png
[http2-push-waterfall]: /images/http2-push-waterfall.png
[push-example-push]: /images/push-example-pushed.jpg
[push-example-no-push]: /images/push-example-not-pushed.jpg
[push-promise]: /images/push-promise.jpg