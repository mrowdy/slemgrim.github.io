---
layout: post
title: "The REST inclusion dilemma"
permalink: /the-rest-include-dilemma/
author: slemgrim
--- 

Designing robust REST endpoints isn't trivial, you always have to consider maintainability, 
scalability and performance. Wrong decisions in the latter often lead to problems with 
the other two. One of them is the inclusion of related resources or short
<abbr title="Inclusion of related resources">IoRR</abbr> (yeah, I made that up).

> A dilemma is a situation in which a difficult choice has to be made between two 
> or more alternatives, especially equally undesirable ones.

REST APIs are usually split into several endpoints to represent different resources. 
Often these resources are related to each other, which leads to a lot of requests until 
we have fetched all the data we need. If this takes too much time, 
it seems obvious to include the related resources with the first response.

An example API response without IoRR
---

```js
//GET /articles/1
{
  data: [
    {
      id: 1,
      type: "article",
      attributes: {...},
      relationships: {
        comments: "http://example.com/article/1/comments",
        author: "http://example.com/article/1/author"
      }
    }
  ]
}
```

So far everything looks fine. We get a single article from an unique endpoint. 
If we need the comments, the response provide us a straightforward way to get them. 
It doesn't give us direct information which comments are related, just where to fetch them. 

<div class="message message--info">
Since the response contains only the article itself and nothing else, 
it can be cached as a whole on server-side. 
</div>

If we have to fetch all the related data, we need multiple requests. Some of the related 
resources can also have related resources which leads to even more requests. 
We'll soon see that this is really time consuming.

Example API response with IoRR
---

```js
//GET /articles/1
{
  data: [
    {
      id: 1,
      title: "article",
      attributes: {...},
      relationships: {
        comments: [
          {
            id: 33,
            type: "comment"
          },
          {
            id: 34,
            type: "comment"
          }
        ],
        author: {
          id: 3,
          type: "author"
        }
      }
    }
  ],
  included: [
    {
      id: 33,
      type: "comment",
      attributes: {...},
      relationships: {
        author: {
          id: 18,
          type: "author"
        }
      }
    },
    {
      id: 34,
      type: "comment",
      attributes: {...},
      relationships: {
        author: {
          id: 18,
          type: "author"
        }
      }
    },
    {
      id: 3,
      type: "author",
      attributes: {...},
    },
    {
      id: 18,
      type: "author",
      attributes: {...},
    }
  ]
}
```

Now everything is contained in one request. One could argue how many levels of nested 
relations we add, but it doesn't matter for this example. 

The first request will probably take a bit longer than in the previous example 
because we have to add the additional resources, i.e., more database queries and processing. 
But since it is the only request, we end up a lot faster than before.

<div class="message message--info">
In case you wonder why I do this "relationship" thingy instead of a self containing article 
document, this is part of the <a target="_blank" href="http://jsonapi.org/">json:api</a>
specification and ensures consistent endpoint design.
</div>

Easy come, easy go. While we gained a lot of speed, we introduced other problems:
        
### Caching

A big part of caching is invalidation. Now that our response consists of more than an article, 
caching gets complicated. Every time a comment or an author resource gets changed we need 
to invalidate the cache of every response which contains that specific resource. 
For this small example that may seem reasonable but in a real world API this renders full-page
caching almost impossible. Caching is not only good for speed, 
but also frees our servers from unnecessary load. 
 
### Maintaining

Where is my data again? Our comments can be fetched from the ```/comments``` endpoint, 
but are also included in the ```/articles``` endpoint. For the authors it gets even worse: 
```/author```, ```/comments``` and ```/article``` all return author information. 
It doesn't take long to lose track of which resource is included in what endpoint. 

### Scaling

> You wanted a banana but you got a gorilla holding the banana, and the entire jungle.

As every other software, APIs grow over time, new endpoints are introduced 
and new relationships arise. If we use IoRR for everything our responses get bigger and bigger.
Consumers which only need a small portion of our data are required to download almost the 
entire database with a single request. And since a lot of clients are already consuming
our API, we are not able to change something easily without wreaking havoc.

Where else do we spend time?
---

A response with included resources will always be faster than multiple resource, 
no mather what we try. If we shift our focus away from the response we might free enough 
precious time to make IoRR unnecessary. 

### Language level

If your API is written in a language that gets interpreted with every API request (i.e., PHP) 
you spend a lot of time booting your application and framework for **every** request. 
Consider moving to a running service where booting occurs only once. 
There are other languages like go or node.js which are way better suited for this kind of task. 

### Caching

As mentioned earlier, caching should always be a big deal in an API. Without inclusion we 
can not only cache the business layer but also the whole response which leads to way 
faster responses and makes our server happy with greatly reduced load. 

### HTTP/2

With HTTP/2 comes [multiplexed](https://http2.github.io/faq/#why-is-http2-multiplexed) 
connections. This means that a client can reuse a open connection. 
In HTTP/1.x a connection gets opened for every request. 
This comes in really handy if we have to make a lot of request for related resources.

TL;DR
---

As the title states: inclusion of related resources is a dilemma. 
Single responses with included relationships will be always faster than multiple 
resources but can be completely avoided if you resolve your performance issues at their root. 
If you have to do includes, be aware of all the trade-offs and future problems you introduce. 