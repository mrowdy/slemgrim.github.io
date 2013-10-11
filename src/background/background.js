define(['app/core', 'background/loop', 'background/renderer', 'background/world'], function(core, Loop, Renderer, World) {
    'use strict';

    return function($canvas){

        if($canvas === null){
            return;
        }

        var loop,
            world,
            renderer;

        var init = function(){
            renderer = new Renderer($canvas);
            world = new World($canvas.width, $canvas.height);
            world.initWorld();

            loop = new Loop({
                updateCallback: update,
                renderCallback: render
            });
            loop.start();

        };

        var update = function(deltaTime){
            world.update(deltaTime);
        };

        var render = function(){
            renderer.draw(world);
        };

        this.canvasChange = function(width, height){
            world = new World(width, height);
            world.initWorld();
        };

        init();
    };
});