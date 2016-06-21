---
layout: post
title: "common mistakes when planing a restful API"
permalink: /rest-mistakes/
author: slemgrim
--- 

RESTFUL services are simple to create. At least it looks like it when you are starting.
In reality its really easy to get a lot of things wrong. I, like everybody else, made a lot of bad decisions
which bit me in the ass later on.

The following article is a list of common mistakes when designen REST API's and how to prevent them.
Keep in mind that there is no perfect REST design nor a ultimate guide.
In the end everyone has to come up with an architecture that works for him.

Methods, they have a purpose
---

Every web developer should at least know about `GET` and `POST`.
Yeah those two you use in every HTML form since forever.
But there a more than these two and each has its own purpose.

### Mistake

GET to retrieve data
POST for everything else.

### Problem
### Solution


Whats the thing with PUT and POST?
---

I'll heard a lot of different definitions when to use what.
The most common was: POST for creating and PUT for editing.

A more correct version would be:
Use Put when we do know the unique identifier of a resource
Use Post when we don't know the unique identifier of a resource

For example:

When you add a new user you don't know the user id. That's because it probably will be generated on server
side.

```
POST /users/
{
    "username": "slemgrim"
}
```

Your user will be inserted into the database, a unique identifier will be created. Now you are able to fetch that user:

```
GET /users/42
{
    "id": 42,
    "username": "slemgrim"
}
```

And now that you know the identifier, you can use PUT to edit the user.

```
PUT /users/42
{
    "username": "slemgrim"
}
```

Wrong used methods lead to redundant endpoint naming
---

Read, Add, Edit, Delete? Everything is either GET or POST, how sould i know what an endpoint does?
Simple, we write it in the endpoint.

### Mistake

```
GET /users/all Read all users
GET /user/one/42 Read one specific user
POST /users/create/ Add a new user
POST /users/delete/42 Edit an existing user
POST /users/edit/42 Delete an existing user
```

### Problem

You will end up with a lot of endpoints. Every method has a custom named endpoint.
User is just a single resource, usually you have more of them.
Soon it will get realy hard to keep track of them all.

### Solution

We've learned that there are more methods. So why not use them.
All the User endpoints from above can be merged into one.

GET /users
GET /users/42
POST /users
PUT /users/42
DELETE /users/42

Relations
---

Output format
---

```
GET /article/4
```

What should i get from that endpoint? Plane text? XML? YAML?
A few years a go everything was XML but that has changed greatly. The whole web speaks JSON.

```
    "article": {
        "title": "API's are awesome",
        "body": "Lorem ipsum..",
        "published": "1994-11-05T13:15:30Z"
    }
```

While there are tools to parse XML and JSON for every language,
JSON wins because it is simpler, better readable, and smaller in size.
Read more JSON advantages at (http://www.json.org/xml.html)[json.org]

Input Format
---

How should i send my data to an API. There aren't that much possibilities:

### QueryString

/POST /article/?title=API%27s%20are%20awesome&body=Lorem%20Ispum&published=1994-11-05T13%3A15%3A30Z

#### PRO
~~You can try it in the browser~~

#### Contra
- (TODO)[what should i put in a queryString]
- Everything needs to be url encoded
- Query Strings have a (http://stackoverflow.com/questions/812925/what-is-the-maximum-possible-length-of-a-query-string)[limit]
- Nested data gets really hard.

### Form-data

When you use HTML forms with the POST method, your data is transfered as form-data. Which means you send your data
as key value pairs. In an HTTP request this is done by form boundaries.

```
/POST /article/
Content-Type: multipart/form-data; boundary=----FormBoundaryXYZ123

----FormBoundaryXYZ123
Content-Disposition: form-data; name="title"

API's are awesome
----FormBoundaryXYZ123
Content-Disposition: form-data; name="body"

Lorem ipsum..
----FormBoundaryXYZ123
Content-Disposition: form-data; name="published"

1994-11-05T13:15:30Z
----FormBoundaryXYZ123

```

#### PRO
Same mechanism as HTML Forms
Easy to read at server side (depends on language)
Supported in most clients (e. g. curl)

#### Contra
- Nesting is as hard as with query params

### x-www-form-urlencoded

```
/POST /article/
Content-Type: application/x-www-form-urlencoded

foo=bar&bar=baz
```

Interchangeable Params
---

Envelopes
---

Standards
---

Headers
---

Authentication
---

Caching
---

Timeformat
---

Use UTC

What should i put into the query string?
---

Not using the right tools
---

- swagger
- postman