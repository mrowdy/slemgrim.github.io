---
layout: post
title: "common mistakes when planing a restful API"
permalink: /rest-mistakes/
author: slemgrim
--- 

RESTFUL services are simple to create. At least it looks like it when you are starting.
In reality its really easy to get a lot of things wrong. I. like everybody, made a lot of bad decisions
which bit mi in the ass later on.

The following article is a list of common mistakes and how to prevent them.
Keep in mind that there isn't a perfect REST design nor a definite path.
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
While you definitely can work with this, it isn't perfectly right.

A more correct version would be:
Put when i do know the unique identifier of a resource
Post when i don't know the unique identifier of a resource

For example:

When you add a new user you don't know the user id. That's because it wil be generated on server
side. But lets say you want to create a postal address where the unique identifier is street and address.

PUT /???/???

Wrong used methods lead to redundant endpoint naming
---

Read, Add, Edit, Delete? Everything is eather GET or POST, how sould i know what an endpoint does?
Simple, we write it in the endpoint.

### Mistake

```
GET /users/all Read all users
GET /user/one/42 Read one specific user
POST /users/add/ Add a new user
POST /users/delete/42 Edit an existing user
POST /users/update/42 Delete an existing user
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


