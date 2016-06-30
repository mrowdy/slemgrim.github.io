---
layout: post
title: "HTTP Methods, they have a purpose"
permalink: /http-methods/
author: slemgrim
disqus_identifier: 0d914523af-8e13-4a91-91e1-b814c25ce757
---

A lot of REST APIs out there are limited to `GET` and `POST` HTTP calls for
reading and modifying resources. This surely works for small projects,
but if you are about to design a long lasting API it can save you a
lot of trouble if you use the right method in the right situation.

APIs are not HTTP forms.
---

Most web developers are familiar with `GET` and `POST` from years of dealing
with HTML forms.

```
<form method="post">
    ...
</form>
```

With forms there isn't much we can do wrong:

- `GET` for fetching resources
- `POST` for everything else

Of course we can apply this pattern to APIs:

```
GET /articles
GET /articles/42
POST /articles/add
POST /articles/edit/42
POST /articles/delete/42
```

2 endpoints for fetching, and 3 endpoints for manipulating resources.
The verb at the end of each endpoint definition gives us a good idea what its purpose is.
But the fact that verbs in endpoint names is considered bad behavior and the blatant ignoring of HTTP methods
are just two reason why we should avoid this pattern.

After learning about all the other HTTP methods we revisit this example.

## GET - For reading resources.

Every time we want to read data from an API we use `GET`.
Be it a single resource or a collection of resources, `GET` is the way to go.
We absolutely never change, create or delete a resource with a `GET` request.
We're not even allowed to send a body-entity with it.

If we need parameters for filtering, pagination or other formatting reasons
we can use query params. I'll do a separate article about the right usage of
query params in the future.

### Examples
```
GET api.example.com/articles/42
GET api.example.com/articles/?page=1
GET api.example.com/articles/?filter[title]=Foo&order=date
GET api.example.com/articles/?format=JSON
```

All relevant information of a `GET` request is contained in the URI itself.
This brings a few benefits:

- `GET` requests are cachable
- They can be bookmarked and are shareable
- Browser history can keep track of them

<div class="message message--info">
Query strings are just one way to send information,
they are neither limited to GET nor do they have anything to do with GET.
All the other methods also support query strings.
</div>

<div class="message message--info">
That GET requests are limited in length is another common misconception.
The <a href="https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2.1">RFC</a>
makes clear that there is no limit of length.
However there are limits in different browser implementations</div>

## HEAD

The `HEAD` method is quite similar to the `GET` Method.
The only difference is the missing body-entity in the response.

We can use it to check the response headers without the need to download
the full resource. We, for example, can check the `Last-Modified` header
to decide if we have to re-download a resource or use a cached one.

## POST

This method is mostly used for creating resources.
The limitation is that we don't know the specific URI of a resource.
If we are about to create a new resource, and don't know its ID, we send it
to the root endpoint of that resource.

```
POST /article/
{
    "title": "Foo bar",
    "text": "Lorem Ipsum..."
}
```

The API will create the resource and responds with an unique location
(now with an ID). We use this location for further calls on that endpoint.

```
HTTP/1.1 201 Created
Location: /articles/42
```

Now that we know the unique URL of the just created resource (`/articles/42`)
we don't have any reason to use other `POST` request with that resource.

If we send the same request a second time, the API either creates a new article with a different ID or tells
us that this article already exists. This means that `POST` is not idempotent nor safe. But more on that later.

### PUT

If we know the unique URI of a resource (e.g. /articles/42) we can use `PUT` to manipulate it.
This is also true if we know the unique URI of a resource that doesn't exist yet.
So we can also use it to create resources.

```
PUT /article/43
{
    "title": "Hello World",
    "text": "Lorem Ipsum..."
}
```

<div class="message message--info">
Instead of saying "POST to create resources and PUT to
edit resources" we should say:
"PUT when we know the unique URI and POST if we don't"
</div>

### DELETE

With `DELETE` we request that a resource should be deleted on the server.

```
DELETE /article/42
DELETE /article
```

The first example would delete the resource with the id 42. The second one would
delete all resources of that type.

There is no guarantee that the operation has been carried out.
The server can delete a resource or just flag it as deleted, that's up to the API
and shouldn't concern you.
As with `PUT`, it's required to know the unique URI of a resource to delete it.

### TRACE

The probably most simple method. Send something with `TRACE` and it will
reply with the same thing inside its body-entity.

```
TRACE /endpoint/
Time is an illusion. Lunchtime doubly so.
```

Should return:

```
200 OK
Time is an illusion. Lunchtime doubly so.
```

We use this method mainly for testing what the server receives
and if it gets manipulated by a proxy or someone else in the request chain.

### OPTIONS

This method is used to inform a client over the capabilities of an endpoint.
It should respond with `200 OK` and should have at least an `ALLOW` header.

```
200 OK
Allow: GET, PUT, POST, DELETE
```

If there is a body-entity it should give information about the communication options.
We can use this to inform a client which HTTP Methods are implemented.

> If the OPTIONS request includes an entity-body, then the media type MUST be
> indicated by a Content-Type field. Although this specification does not define any use for such a body,
> future extensions to HTTP might use the OPTIONS body to make more detailed queries on the server.

As the format of the body-entity is not described by the RFC we can use it for our own purpose like
[documenting](http://zacstewart.com/2012/04/14/http-options-method.html) our API.

### PATCH

A lot of people say that `PATCH` is similar to `PUT` but that isn't true at all.
With `PATCH` we can edit parts of a resource instead of replacing the whole resource with a new one.
The problem is that "replace parts" isn't what you would think at first.


Given the resource:

```
{
    "id": 42,
    "title": "Lorem Ipsum..",
    "text": "...",
    "author": "Slemgrim"
}
```

We could implement a `PATCH` like this:

```
PATCH /articles/42
{
    "title": "Foo bar baz"
}
```

But that is wrong. A `PATCH` request should contain the description of a change
and not only the changed value.

```
PATCH /articles/42
[replace the value at location "title" with "Foo bar baz"]
```

Like with `OPTIONS` the RFC doesn't define a format. So we can do something like this:

````
PATCH /articles/42
{
    "operation": "replace",
    "property": "title",
    "value": "Foo bar baz"
}
````

### CONNECT

A `CONNECT` request induces a proxy/client to establish a HTTP tunnel to the endpoint.
Usually it is used for SSL connections, but can be used with HTTP as well.
In most cases it is used for proxy-chaining and tunneling.

```
CONNECT api.example.com:443/articles/42
```

## Idempotent and safe Methods

When you can call an endpoint multiple times without its result changing, it is *idempotent*.
For example, a call to `GET /articles/42` will always return the same, while `POST /articles` will create
a new resource with a different ID every time we call it.
A resource can still change between two requests
because it gets edited by someone else, has an updated timestamp or becomes stale.

Methods are safe if they don't change a resource. A `GET` for example
should never change a resource. `DELETE` on the other hand, will always change a resource.
This is important when it comes to caching because safe methods can always be cached.


| Method  | is idempotent | is Safe |
|---------|---------------|---------|
| GET     | yes           | yes     |
| PUT     | yes           | no      |
| POST    | no            | no      |
| PATCH   | no            | no      |
| DELETE  | yes           | no      |
| TRACE   | yes           | no      |
| OPTIONS | yes           | yes     |
| CONNECT | yes           | no      |
| HEAD    | yes           | yes     |

## Lessons learned

With all that in mind, we can safely change the first example:

```
GET /articles
GET /articles/42
POST /articles/
PUT /articles/42
DELETE /articles/42
```

We not only replaced the methods with appropriate ones,
we also were able to remove all verbs from the endpoints.
No more `/add, /edit, /delete`. Now there is only one endpoint left `/articles`.

If we design all our endpoints like this we'll never have to think
"did I call it /create or /add this time".
Our config files and documentation are not bloated with verbs and duplicated endpoints.
And best of all: our consumers can be dead simple and rely on standards.

## TL;DR

Most APIs implement `GET`, `POST`, `PUT` and `DELETE`. Other methods are quite useful
but depending on the application, more of a nice to have than a requirement. We should always
think twice which method is the right one for our purpose.