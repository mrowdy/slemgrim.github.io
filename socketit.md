---
layout: page
title: SocketIt
permalink: /socketit/
---

SocketIt is a modular connection system for Unity based on sockets. Connect prefabs at run-time and snap them together.
Build large structures, complex vehicles or use it to build characters. 

Features
---
* **Socket based system**: A module (prefab) can have various sockets represented as GameObjects with their own transformation. Modules can be connected with their sockets. The
shape of your prefab doesn't matter, SocketIt is shape independent.

* **Snapping**: Snap Modules to other modules. Instant snapping and physics based LERP snapping is included. This also works on moving modules. You can also use your custom snapper. 

* **Snap Validation**: Don't want different sockets to snap together? Snaps can be validated by your own components. 

* **Connect Validation**: Like with snaps. Connections can also be validated. Your custom connect validator component gets called whenever a connect is triggered.

* **Modular**: Don't need snapping? Don't need a base system? Use only the components you need, SocketIt is modular. This makes the setup a little more complicated but gives 
you fine grained controll. 

* **Extensible**: Since SocketIt is split in multiple components and operates on interfaces you can easily replace single components by your own. 

* **Event-Driven**: Every noteworthy action like connect, disconnect or snap triggers a delegate. Inject your game logic without touching the SocketIt code. 

* **Descriptive**: Connections are stored on modules and can be reverted at any time. You will always know which module are connected together and who triggered the connection.

* **Parenting**: A tree like system can be used on top of the module system. Complete with parent and child node handling.

* **Base Modules**: Base modules handles all their child modules and can be used to activate/deactivate them. 

* **Prefabs**: Every feature comes with a pre-built preset for a quick start. 

* **Standalone**: SocketIt runs with plain Unity and doesn't have other dependencies.

* **Examples**: This package includes a lot of example scenes with showcase for every feature. 

Limitations
---

* no built in saving/restoring of structures (planned)
* no editor integration (planned)

Issues
---

Please use the github issue tracker (TODO Link)
or contact my under socketit@defyinggravity.com

-----

PLEASE NOTE: You are allowed to use any of the assets that comes with the asset in your project for commercial use.