HTTP Methods, they have a purpose
===

A lot of REST API's out there are limited to `GET` and `POST` HTTP calls for
reading and modifying resources. This surely works for small projects,
but if you are about to design a long lasting API it can save you a
lot of trouble if you use the right method in the right situation.

API's are not HTTP forms.
---

Most web developers are familiar with `GET` and `POST` from years of dealing
with html forms.

```
<form method="post">
    ...
</form>
```

With forms there isn't much we can do wrong:

- `GET` if we want to fetch a resource
- `POST` for everything else

with REST API's this is more complicated. We sure can design our endpoints the
same way:

```
GET /articles
GET /articles/42
POST /articles/add
POST /articles/edit/42
POST /articles/delete/42
```

2 endpoints for fetching, and 3 endpoints for manipulating resources.
The verb in each endpoint definition gives us a good idea what its purpose is.
Nothing seems wrong at first, but after learning more about other HTTP Methods
we revisit this example and tear it apart.

## GET - For reading resources.

Every time we want to read data from an API we use `GET.
Be it a single resource or a collection of resources, `GET` is the way to go.`
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

Every relevant information of a GET request is contained in the URI itself.
This brings a few benefits:

- Get Requests are cachable
- They can be bookmarked and are shareable
- Browser history can keep track of them

<div class="message message--info">
Query strings are just one way to send information,
they are neither limited to 'GET' nor do they anything to do with `GET`.
All the other methods also support query strings.
</div>

<div class="message message--info">
`GET` requests are limited in length is another common misconception.
The [RFC](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2.1)
makes clear that there is no limit of length.
However there are limits in different browser implementations</div>

## HEAD

The `HEAD` method is quite similar to the `GET` Method.
The only difference is the missing body-entity in the response.

We can use it to check the response headers without the need to download
the full resource. We can for example check the `Last-Modified` header
to decide if we have to re-download a resource or use the cached one.

## POST

This method is mostly used for creating resources.
The limitation is that we don't know the specific URI of a resource.
If we are about to create a new resource, and don't know its id, we send it
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

Now that we know the unique URL of the just created resource `/articles/42`
we shouldn't use any more `POST` requests with the resource.

IF we send the same request a second time, the server either creates an new article with another ID or tells
us that this article already exists. This means that `POST` is not idempotent nor safe. But more on that later.

### PUT

If we know the unique URI of a resource (e.g. /articles/42) we can use `PUT` to manipulate it.
This is also true if we know the unique URI of a resource that doesn't exist yet.
So we also can use it to create resources.

```
PUT /article/43
{
    "title": "Hello World",
    "text": "Lorem Ipsum..."
}
```

<div class="message message--info">
Instead of saying "POST to create create resources and PUT when to
edit resources" we should say:
"PUT when we do know the unique URI and POST if we don't"
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
and shouldn't concerne you.
As with `PUT`, its required to know the unique URI of a resource do delete it.

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
and if it gets changed by a proxy or someone else in the request chain.

### OPTIONS

This method is used to inform a client over the capabilities of an endpoint.
It should respond with `200 OK` and should have at least an `ALLOW` header.

```
200 OK
Allow: GET, PUT, POST, DELETE
```

If there is a body-entity it should information about the communication options.
We can use this to inform a client which HTTP Methods are implemented.

> If the OPTIONS request includes an entity-body, then the media type MUST be
> indicated by a Content-Type field. Although this specification does not define any use for such a body,
> future extensions to HTTP might use the OPTIONS body to make more detailed queries on the server.

As the format of the body-entity is not described by the RFC we can use it for our own purpose like
[documenting](http://zacstewart.com/2012/04/14/http-options-method.html) our API.

### PATCH

A lot of people will say that `PATCH` is similar to `PUT` but that isn't true at all.
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

Now we could send a patch like this:

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

A `CONNECT` request induces a proxy/client to establish an HTTP tunnel to the endpoint.
Usually is it used for SSL connections, but can be used with HTTP as well.
In most cases it is used for proxy-chaining and tunneling.

```
CONNECT api.example.com:443/articles/42
```

## Idempotent Methods

When you can call an endpoint multiple times without its result changing, it is *idempotent*.
For example you call `GET /articles/42` it always should return the same.

###Idempotence of methods

| Method  | is idempotent |
|---------|---------------|
| GET     | yes           |
| PUT     | yes           |
| POST    | no            |
| PATCH   | no            |
| DELETE  | yes           |
| TRACE   | yes           |
| OPTIONS | yes           |
| CONNECT | yes           |
| HEAD    | yes           |

A resource can still change between two requests
because it gets edit by someone else, has an updated timestamp or becomes stale.

## Save Methods

Methods are save if they don't change a resource. A `GET` for example
should never change a resource. `DELETE` on the other side, will always change a resource.
This is important when it comes to caching, save methods can always be cached.

| Method  | is Save |
|---------|---------|
| GET     | yes     |
| PUT     | no      |
| POST    | no      |
| PATCH   | no      |
| DELETE  | no      |
| TRACE   | no      |
| OPTIONS | yes     |
| CONNECT | no      |
| HEAD    | yes     |

## Lessons Learned

With all that in mind we can safely change the first example:

```
GET /articles
GET /articles/42
POST /articles/
PUT /articles/42
DELETE /articles/42
```

We not only replaced the methods with appropriate ones,
we also were able to remove all verbs from the endpoints.
No more '/add, /edit, /delete'. Now there is only one endpoint left '/articles'.
This is not only simpler for the consumer of the api,
it's also easier to maintain when you only have on route to define.
It also prevents you from inconsistent endpoint naming
(add and create, edit and update, delete and remove).

## Real World

Most API's implement `GET, POST, PUT and DELETE`. All the other methods are nice to have. But if you don't use
them return at least a `501 Not Implemented`.