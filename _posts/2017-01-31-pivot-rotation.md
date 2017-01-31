---
layout: post
title: "Rotation by pivot in Unity editor"
permalink: /unity-editor-pivot-rotation/
author: slemgrim
--- 

{% include video.html 
    mp4="/images/pivot-rotation/pivot-rotation-parent.mp4" 
    webm="/images/pivot-rotation/pivot-rotation-parent.webm" 
%}
 
Ever tried to rotate a `GameObject` by a pivot point instead of its own origin 
inside the Unity editor? Rotation by origin is simple, just use the provided rotation 
handles. But there are no handles for pivot rotation and [Transform.RotateAround()](https://docs.unity3d.com/ScriptReference/Transform.RotateAround.html) 
is only helpful inside the actual game. 

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

Imagine two objects which are connect with a 
hinge joint and you need to set the angle to a specific value before the game starts. 
Or the prefab of a turret with multiple degrees of freedom needs to be set up properly.
 
When you search for this problem in Google you find answers like "move the origin to the center of your rotation" but that involves firing up your 
modeling software. In most cases the origin is at a reasonable position where it should stay. 
So this isn't a solution either.

Unity's editor is extremely customizable. It's really simple to create custom rotation handles and
use them for pivot rotation like `Transform.RotateAround()`.

![pivot rotation setup][pivot-rotation-setup]{:class="img-inline"} 

Lets say we want to rotate the cube (```target```) in the image around the two spheres (```pivots```).
We need to create a new component before we can add custom rotation handles to the pivots.

```java
using UnityEngine;

public class RotationPivot: MonoBehaviour
{
    /**
     * The transform of the object you want to rotate with this pivot 
     */
    public Transform target;
}    
```

Apply the component to the pivot and set the cube as target. 
In order to extend the script with custom rotation handles, we need another script under
`Editor/RotationPivotEditor.cs`.

<div class="message message--info">
Editor is a special Unity folder. Every script inside it will only get loaded inside the editor.
These scripts get stripped from builds.
</div>

The folder structure should look like this:

```
- Editor/
    - RotationPivotEditor.cs
- RotationPivot.cs
    
```

To enhance our RotationPivot we have to add the `[CustomEditor]` annotation 
and inject our code inside the `OnSceneGUI()` method. This method gets called every time 
the Scene GUI is redrawn, which is the perfect place for our rotation handles.

``` java
/**
 * Custom editor for RotationPivot 
 */
[CustomEditor(typeof(RotationPivot))]
public class RotationPivotEditor : Editor {

    void OnSceneGUI()
    {
        //The RotationPivot component of the selected game object
        RotationPivot rotationPivot = (RotationPivot)target;

        //Return if rotationPivot has no target
        if(rotationPivot.target == null)
        {
            return;
        }

        /* Display a custom rotation handle with the position and rotation of 
        rotationPivot and store its value inside newRotation as a Quaternion */
        Quaternion newRoation = Handles.RotationHandle(
            rotationPivot.transform.rotation, 
            rotationPivot.transform.position
        );
    }
}
```

This is all we need to create a custom rotation handle on all our RotationPivot components.
If you click one of your spheres you should see the rotation handles. But for now they are kinda useless.

![pivot with custom rotation handle][pivot-with-handle]

The next step is to apply the rotation from the handle to our pivot and its target. Since we want 
to be able to use this both in editor and ingame we create a method on the `RotationPivot` component.

```java
...

public void SetRotation(Quaternion newRotation)
{
    //Set the pivot as the parent of target
    target.transform.SetParent(transform);

    //Apply new rotation to pivot. Here the magic happens
    transform.rotation = newRotation;

    //Remove parent from the target
    target.transform.SetParent(null);
}

...
```

The main trick here is to set the pivot as a transform parent of the target and reset it at the end.
With this the target moves with the pivot without any complicated calculations.

We use this method whenever the rotation of the handle differs from the pivots own rotation.
This makes sure that the rotation is only applied when the handles are used instead of every frame.

```java
...

//Continue only if the new rotation differs from the current rotation
if (newRoation != rotationPivot.transform.rotation)
{
    //Apply the new rotation
    rotationPivot.SetRotation(newRoation);
}

...
```

We can fire up the editor and try it out after both scripts are connected.

{% include video.html 
    mp4="/images/pivot-rotation/pivot-rotation-1.mp4" 
    webm="/images/pivot-rotation/pivot-rotation-1.webm" 
%}
 
While this already works for this simple scenario, there are a few limitations.
What would happen if the target already has a parent before we apply the rotation?
Right, the target would lose its parent. We can fix this by storing the parent and reapplying it
when we are finished. 

We do the same with the pivot's parent, since we want to be able to use the pivot as a 
child element later on.

```java
...

    public void SetRotation(Quaternion newRotation)
    {
        //We store current parents of pivot and target
        Transform oldPivotParent = transform.parent;
        Transform oldTargetParent = target.transform.parent;
        
        //Set the pivot as the parent of target
        target.transform.SetParent(transform);

        //Apply new rotation to pivot. 
        transform.rotation = newRotation;

        //Restore old parents
        transform.SetParent(oldPivotParent);
        target.transform.SetParent(oldTargetParent);
    }

...
```

Unity doesn't allow to switch a parent->child relationship. When a pivot is a
direct child of the target nothing will happen. We can circumvent the direct relationship
by setting both to `null` before we change the parents.

```java
...

    public void SetRotation(Quaternion newRotation)
    {
        //We store current parents of pivot and target
        Transform oldPivotParent = transform.parent;
        Transform oldTargetParent = target.transform.parent;

        RemoveParents();

        //Set the pivot as the parent of target
        target.transform.SetParent(transform);

        //Apply new rotation to pivot. 
        //Target follows since it has the pivot as parent now
        transform.rotation = newRotation;

        RemoveParents();

        transform.SetParent(oldPivotParent);
        target.transform.SetParent(oldTargetParent);
    }

    private void RemoveParents()
    {
        target.transform.SetParent(null);
        transform.SetParent(null);
    }
    
...
```

{% include video.html 
    mp4="/images/pivot-rotation/pivot-rotation-parent.mp4" 
    webm="/images/pivot-rotation/pivot-rotation-parent.webm" 
%}

Now we are able to rotate a gameObject by as many pivots as we want without destroying the
hierarchy of the objects. Even when the pivots are child objects of their target.

And to make it complete, we add an undo functionality since it's really annoying to undo editor actions
by hand.

```java
...

//Continue only if the new rotation differs from the current rotation
if (newRoation != rotationPivot.transform.rotation)
{
    //Register a undo action both on the rotationPivot and its target
    Undo.RecordObject(rotationPivot.transform, "Rotate by pivot");
    Undo.RecordObject(rotationPivot.target, "Rotate by pivot");

    //Apply the new rotation
    rotationPivot.SetRotation(newRoation);
}

...
```

You can find the whole code for this tutorial on [github](https://gist.github.com/Slemgrim/a0e93bfb17659eb8229a97fd47d7f15c).
Drop the two scripts in your project and apply them to your objects. 

[rotation-handle-icon]: /images/pivot-rotation/rotation-handle-icon.png
[pivot-rotation-setup]: /images/pivot-rotation-setup.png
[pivot-with-handle]: /images/pivot-rotation/pivot-with-handle.png