define(["app/core"], function(core) {
    'use strict';
    /*global window */

    return function($canvas){

        if($canvas === null){
            return false;
        }

        var width,
            height,
            listener = [],
            resizeTimeout = 200,
            resizeCallback = null;


        this.registerListener = function(obj){
            listener.push(obj);
        };

        this.update = function(){
            resizeCanvas();
        };

        var init = function(){
            eventBindings();
            resizeCanvas();
        };

        var eventBindings = function(){
            core.event.add(window, 'resize', resizeCanvas);
        };

        var resizeCanvas = function(){
            if(resizeCallback != null){
                clearTimeout(resizeCallback);
            }

            resizeCallback = window.setTimeout( function(){
                resize();
            }, resizeTimeout);
        };

        var resize = function(){
            getSize();
            setSize();
            notify();
        };

        var getSize = function(){
            width = $canvas.offsetWidth;
            height = $canvas.offsetHeight;
        };

        var setSize = function(){
            $canvas.setAttribute('width', width);
            $canvas.setAttribute('height', height);
        };

        var notify = function(){
            for(var i = 0; i < listener.length; i++){
                listener[i].canvasChange(width, height);
            }
        };
        init();
    };
});