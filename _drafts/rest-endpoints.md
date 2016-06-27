HTTP Methods, they have a purpose
===

A lot of REST API's out there are limited to `GET` and `POST` endpoints. Most web developers
know these two from their beginning with HTML forms. Sadly their API's are designed like HTML Forms.

They use `GET` when they want to fetch something from the server and `POST` for everything else.
Obviously this works in most cases but we can better.

### An example

```
GET /articles
GET /articles/42
POST /articles/add
POST /articles/edit/42
POST /articles/delete/42
```

In case you have to consume an API like this you would have no problems understanding the purpose
of each endpoint. But if you are the author you just have made your life a little bit harder.

The Methods
---

### GET - Request data from a specified resource

Every time you want to read data from an API you use 'GET'.
A `GET` endpoint can have various parameters usually provided inside the query string

**Examples**
```
GET api.example.com/articles/42
GET api.example.com/articles/?page=1
GET api.example.com/articles/?filter[title]=Foo&order=date
GET api.example.com/articles/?format=JSON
```

Get requests can't have a body. Which means all needed information is contained inside the URI.
Which brings a lot of benefits:

- Get Requests are cachable
- You can bookmark and share them
- Browser history can keep track of them

<div class="message message--info">
When you first learned about it you probably heard that a `GET` request comes with a query string.
attached to the URI. Query strings are just a way to send information, they have nothing to do with `GET`.
All the other methods also support query strings.
</div>

<div class="message message--info">
`GET` requests are limited in length is another common misconception. The [RFC](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2.1)
makes clear that there is no limit of length. However there are different limits in different browser implementation</div>

### HEAD

The `HEAD` method is similar to the `GET` Method.
The only difference is the missing body in the response of the `HEAD` request.

We can use it to check the response headers without the need to download the full resource.
You can for example check the `Last-Modified` header to decide if you have to re-download a resource or
use the cached one.


### POST

The `POST` method is mostly used to create a resource.
But only if you don't know the unique identifier of the new resource.

Lets say you are about to create an new article:

```
POST /article/
{
    "title": "Foo bar",
    "text": "Lorem Ipsum..."
}
```

The server will respond with:

```
HTTP/1.1 201 Created
Location: /articles/42
```

After creation you know the ID for that article. So there is no need to use `POST` for any further
calls on this resource.

IF you make the same call a second time, the server either creates an new article with another ID or tells
you that this article already exists. This means that `POST` is not idempotent. But more on that later.

### PUT

We used `POST` to create a resource. After the creation we can use PUT to edit a resource.
With put we always need to know the unique URI of a resource.

```
PUT /article/43
{
    "title": "Hello World",
    "text": "Lorem Ipsum..."
}
```

So instead of saying "POST when we create something and PUT when we edit something" we should say:
"PUT when we do know the unique URI of the resource and POST if we don't"

### DELETE

With `DELETE` we request that a resource should be deleted on the server. There is no guarantee that
the operation has been carried out. The server can delete a resource or just flag it as deleted.
As with put, its required to now the unique URI of a resource do delete it

**Possible return types**

- **200 OK** when a resource was successfully deleted.
- **202 Accepted** if the action was accepted but not carried out yet
- **204 No Content** if the response doesn't contain a body

### TRACE

Trace is probably the most simple method. It returns the same thing you send to it.
We use this method mainly for testing what the server receives and if it gets changed by someone in
the request chain. The response should always be `200 OK` and the send information inside the body entity
alongside an Content-Type of `message/http`.

```
POST /article/
PING
```

Should return

```
200 OK
PING
```

Its like Ping-Pong except that the other one is to stupid to say pong and replies with ping.

### OPTIONS

This method is used to inform a client of capabilities of an endpoint.
It should respond with `200 OK` and should have at least an `ALLOW` header.

```
200 OK
Allow: GET, PUT, POST, DELETE
```

If there is a body it should information about the communication options.
But the spec doesn't say anything about the format of these options.

### PATCH

Patch is similar to `PUT` with the difference that you only change parts of an resource.
`PUT` *replaces* a resource with a new one.
`PATCH` *changes parts of an existing resource.

Given an resource with multiple fields:
```
{
    "id": 42,
    "title": "Lorem Ipsum..",
    "text": "...",
    "author": "Slemgrim"
}
```

With `PATCH` we can only change one field leaving the others the way they are.

```
PATCH /articles/42
{
    "title": "Foo bar baz"
}
```

### CONNECT

A `CONNECT` request induces your proxy to establish an HTTP tunnel to the endpoint.
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
because it gets edit by someone else, or get stale, or various other reasons.

## Save Methods

Methods are save if you can't change a resource with them. A `GET` for example
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

We not only replaced the methods with appropriate ones, we also were able to remove all verbs from
the endpoints. No more '/add, /edit, /delete'. Now there is only one endpoint left. This is not only way
simpler for the consumer of the api, it also is easier to maintain when you only have on route to define.
It also prevents you from inconsistent endpoint names (add and create, edit and update, delete and remove).

## Real World

Most API's implement `GET, POST, PUT and DELETE`. All the other methods are nice to have. But if you don't use
then return at least a `501 Not Implemented`.