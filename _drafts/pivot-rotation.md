---
layout: post
title: "Rotation by pivot in Unity editor"
permalink: /unity-editor-pivot-rotation/
author: slemgrim
--- 

TODO title image

Ever tried to rotate a `GameObject` by a pivot point instead of its own origin 
inside the Unity editor? If you need this inside your game you would use 
[Transform.RotateAround()](https://docs.unity3d.com/ScriptReference/Transform.RotateAround.html)
but what about the editor?

``` java
//Rotating a game object by a pivot point

GameObject target; //The object we want to rotate
GameObject pivot; //The point we want to rotate around
float speed = 10; //Speed of the rotation
Vector3 direction = pivot.transform.forward; //rotation direction

target.transform.RotateAround(
    pivot.transform.position, 
    direction, 
    speed * Time.deltaTime
);
```

Moving the origin around isn't an option since this requires a lot of unnecessary work
in your modeling software. Obviously you don't want to touch finished assets just to reset the 
position of its origin.

Unity with all its API's turns a lot of rocket science into easy digestible pieces.
Remember the rotation handles you use when you do simple rotations? 

![rotation handles][rotation-handle-icon]{:class="img-inline"} 

What if you could create your own rotation handles and control a pivot rotation with it?
Well you can. And its easy.

Lets say we have a object `target`we want to rotate and another object which acts as the `pivot` 

![pivot rotation setup][pivot-rotation-setup]{:class="img-inline"} 

[rotation-handle-icon]: /images/rotation-handle-icon.png
[pivot-rotation-setup]: /images/pivot-rotation-setup.png