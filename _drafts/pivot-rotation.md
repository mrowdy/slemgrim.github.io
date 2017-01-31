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
Well you can. And it's easy.

Lets say we want to rotate the cube (```target```) in the image around the two spheres (```pivot```)

![pivot rotation setup][pivot-rotation-setup]{:class="img-inline"} 

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
Whenever we try to extend the editor we should separate the enhanced code from our game code.
Create the file ```Editor/RotationPivotEditor```.

<div class="message message--info">
Editor is a special Unity folder. Every script inside it will only get loaded inside the editor.
These scripts get stripped from builds.
</div>

The folder structure should look like this:

```
- Editor/
    - RotationPivotEditor
- RotationPivot
    
```

To enhance our RotationPivot indise the editor we have to add the `[CustomEditor]` annotation 
and inject our code inside the `OnSceneGUI()` method.

``` java
/**
 * Custom editor for RotationPivot 
 */
[CustomEditor(typeof(RotationPivot))]
public class RotationPivotEditor : Editor {

    /**
     * Gets called everytime the scene GUI is redrawn. 
     * Only if the gameObject is slected in the inspector
     */
    void OnSceneGUI()
    {
        //The RotationPivot component of the selected game object
        RotationPivot rotationPivot = (RotationPivot)target;

        //Return if rotationPivot has no target
        if(rotationPivot.target == null)
        {
            return;
        }

        /* Display a RotationHandle with the position and rotation of 
        rotationPivot and store its value inside newRotation */
        Quaternion newRoation = Handles.RotationHandle(
            rotationPivot.transform.rotation, 
            rotationPivot.transform.position
        );
    }
}
```

This is all we need to crate a custom rotation handle on all our rotationPivot components.
If you click one of your spheres you should see the rotation handles. For now they are kinda useless.

![pivot with custom rotation handle][pivot-with-handle]

The next step is to add the actual rotation. We do this with an method on the component.

```java
...

public void SetRotation(Quaternion newRotation)
{
    //Set the pivot as the parent of target
    target.transform.SetParent(transform);

    //Apply new rotation to pivot. 
    //Target follows since it has the pivot as parent
    transform.rotation = newRotation;

    //Remove parent from the target
    target.transform.SetParent(null);
}

...
```

Than we need to use this method inside our editor script.

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

We can try this now in the editor

{% include video.html 
    mp4="/images/pivot-rotation/pivot-rotation-1.mp4" 
    webm="/images/pivot-rotation/pivot-rotation-1.webm" 
%}
 
While this already works for this simple scenario, there are yet a few limitations.
What would happen when the target has a parent transform before we apply the rotation?
Right, the target would lose its parent. We can fix this by storing the parent. 
We do the same with the pivots parent, since we want to be able to use the pivot as a 
child element.

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
        //Target follows since it has the pivot as parent now
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
hierarchy of the objects.

And to make it complete, we add a undo functionality like in every oder editor enhancement.

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

You can find the whole code for this tutiral on [github](https://gist.github.com/Slemgrim/a0e93bfb17659eb8229a97fd47d7f15c).

[rotation-handle-icon]: /images/pivot-rotation/rotation-handle-icon.png
[pivot-rotation-setup]: /images/pivot-rotation-setup.png
[pivot-with-handle]: /images/pivot-rotation/pivot-with-handle.png