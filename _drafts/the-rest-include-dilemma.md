---
layout: post
title: "The REST include dilemma"
permalink: /the-rest-include-dilemma/
author: slemgrim
--- 

Everyone who is in contact with REST API's knows that performance is crucial. 
In order to achieve that, a lot of developers decide to include additional resources in their response
to avoid further requests. But this often comes with a high price. 

A simple API response
---

We start with a response of an articles with a related category. 
For demo purpose we don't care about good endpoint design. 

```js
{
  data: [
    {
      id: 1,
      title: "article",
      attributes: {...},
      relationships: {
        category: "http://example.com/article/1/category",
        comments: "http://example.com/article/1/comments",
      }
    }
  ]
}
```

<div class="message message--info">
Since this is a single resource, we can cash the whole response at API level.
</div>

Now in order to show the category alongside the article, we need to make a further API request. 
This wouldn't be a problem in this simple example, but imagine
a bigger endpoint where you need a resource with multiple related resources.

For every related resource we need an aditional request, or in other words: for every 
related resource we have to spend some more time on waiting. 

```
- request article: 100ms 
    - request category: 100ms
    - request comments: 100ms
        - request authors: 100ms
```

While it is true that we can paralelize some of the requests, 
we still have to wait for the article, before we know which categories and comments to request. 
The same for authors and comments. 

Include everything
---

The solution that seems most simple at first is the inclusion of all related resources.

```js
{
  data: [
    {
      id: 1,
      title: "article",
      attributes: {...},
      relationships: {
        category: "http://example.com/article/1/category",
        comments: "http://example.com/article/1/comments",
      }
    }
  ],
  included: [
    {
      id: 1,
      type: "category",
      attributes: {...}
    },
    {
      id: 22,
      type: "comment",
      attributes: {...}
    },
    {
      id: 2112,
      type: "comment",
      attributes: {...}
    }
  ]
}
```

<div class="message message--warning">
It's really important to keep the includes inside a separate directive instead of 
building a huge article document like you would in your favourite NoSQL database.
</div>
        
Now we don't need further requests because all is contained in the first one. Since REST standards like [HAL](#), [json:api](#)
and many others provide that functionality out of the box, that can't be a bad thing. But be careful young padawan. 
While the only benefit is less requests and therefor les time spent on waiting we introduce new problems:

### No more caching

A big part of caching is invalidation. Now that we have included resources inside the article endpoint we would
have to invalidate the endpoint cache whenever someone changes an article, changes a category, or adds a comment. 
I don't say this is impossible, but usually it is really hard to keep track of such cache constructs. The easier way 
would be to disable the endpoint cache completely and rely on caches deeper in your architecture. For example: cache your service
layer or your persistence layer where a resource is still a single resource. 

### More Complex application structure

In a perfect world a resource can only be fetched from a single endpoint. You get articles from the article endpoint or
Categories from the category endpoint. With inclusions everything gets more complicated. Now you have categories from the category
endpoint and from the article endpoint. So you need logic for that on both places. With an good architecture this can be handled, 
but in most cases this leads to chaos and a lot of duplicated code. 

Time is money
---

Isn't there a better solution than included resources? Before we can answer that question we have to take a look on where
we spent time. 

### Language level

If our API has to boot up every time it gets a request (for example in PHP) you pile up a lot of delay. An empty php
script takes about 20 to 30ms to run. 10 of them takes 300ms. On top of that is your framework which also needs some 
time to boot. The larger the framework, the longer it takes. And then there is your own code which usually also isn't
the fastet. And you got all of that for every f***ing request. I recommend to switch to a language/system which can run in 
the background (thinking go or node API). 

Lets assume our API needs 200ms to boot, and about 50ms to handle a request.  

#### Api that needs to but up for every request

- Request A: 200ms + 50ms
- Request B: 200ms + 50ms
- Request C: 200ms + 50ms
- Request D: 200ms + 50ms

Overall we have 1000ms for 4 requests.

#### Api which is booted once and runs in the background

- Booting: 200ms
- Request A: 50ms
- Request B: 50ms
- Request C: 50ms
- Request D: 50ms

Overall we arrive at 400ms. This is 250% times faster than with the booting example. But that increases with more requetss

- 10 requests are 357% faster
- 100 requests are 480% faster
- 1000 requests are 498% faster

### Caching

Without inclusions we can cache the whole response of an endpoint. 
Lets say a cached resource takes 20ms while a uncached one takes 50ms. In reality this can be even more.
Like with the booting this also saves a lot of time over time. 

- 100 uncached requests take 5000ms
- 20 cached ones only take 2000ms

That means we just saved 3 seconds in just 100 requests. While that doesn't sound much, in an big API with a huge amount 
of consumers this is a lot of time. Less time spent on a request means more parallel requests are possible.

### HTTP

Every requests needs to make a new http connection to your server. More requests means more connections means more 
time spent on nothing. With HTTP2 this isn't true anymore. HTTP2 keeps a connection open for a short time, so subsequent
calls will be handled over the same connection. This again isn't much a benefit for a single request but can make
a huge difference when we have related resources.

Conclusion
---

bla