define(function() {
    'use strict';
    /*global window */

    return function(options) {

        var defaultOptions = {
            deltaTime: 0.01,
            maxFrameTime: 0.25,
            fpsCallback: false,
            renderCallback: false,
            updateCallback: false,
            clock: false
        };

        var status = '',
            time = 0.0,
            fps = 0,
            currentTime = 0.0,
            accumulator = 0.0;

        var STATUS = {
            RUNNING : 0,
            PAUSED : 1,
            STOPPED : 2
        };

        var init = function(){
            if (typeof options === 'object') {
                for (var property in defaultOptions) {
                    if(!options[property]){
                        options[property] = defaultOptions[property];
                    }
                }
            } else {
                options = defaultOptions;
            }

            if(!options.clock){
                options.clock = getAnimationFrame;
            }

            status = STATUS.STOPPED;
        };

        /**
         * Sets updateCallback
         * @param newUpdateCallback
         */
        this.setUpdateCallback = function(newUpdateCallback){
            options.updateCallback = newUpdateCallback;
        };

        /**
         * Sets Render Callback.
         * @param newRendererCallback
         */
        this.setRenderCallback = function(newRendererCallback){
            options.rendererCallback = newRendererCallback;
        };

        /**
         * Start Game
         */
        this.start = function(callback){
            if(status === STATUS.STOPPED){
                currentTime = getCurrentTime();
                status = STATUS.RUNNING;
                if(callback){
                    callback();
                }
                loop();
            }
        };

        /**
         * Pause Game
         */
        this.pause = function(callback){
            if(status === STATUS.RUNNING){
                status = STATUS.PAUSED;
                if(callback){
                    callback();
                }
            }
        };

        /**
         * Stop Game
         */
        this.stop = function(callback){
            if(status !== STATUS.STOPPED){
                status = STATUS.STOPPED;
                if(callback){
                    callback();
                }
            }
        };

        /**
         * Resume Paused Game
         */
        this.resume = function(callback){
            if(status === STATUS.PAUSED){
                status = STATUS.RUNNING;
                if(callback){
                    callback();
                }
                loop();
            }
        };

        this.setFPSCallback = function(callback){
            if(callback){
                options.fpsCallback = callback;
            }
        };

        /**
         * Set new DeltaTime for timesteps
         * @param newDeltaTime
         */
        this.setDeltaTime = function(newDeltaTime){
            options.deltaTime = newDeltaTime;
        };


        /**
         * The Loop
         */
        var loop = function(){
            if(status === STATUS.RUNNING){
                var newTime = getCurrentTime();
                var frameTime = newTime - currentTime;

                fps = (1 / frameTime) * 1000;
                if(options.fpsCallback){
                    options.fpsCallback(fps);
                }

                if(frameTime > options.maxFrameTime){
                    frameTime = options.maxFrameTime;
                }

                currentTime = newTime;
                accumulator += frameTime;

                while(accumulator >= options.deltaTime){
                    if(options.updateCallback){
                        options.updateCallback(options.deltaTime);
                    }
                    time += options.deltaTime;
                    accumulator -= options.deltaTime;
                }

                if(options.renderCallback){
                    options.renderCallback();
                }

                options.clock(loop);
            }
        };

        /**
         * @returns int current time in milliseconds
         */
        var getCurrentTime = function(){
            var date = new Date();
            return date.getTime();
        };


        /**
         * Default game clock. Uses requestAnimationFrame or ~60fps timeout
         * @param callback
         */
        var getAnimationFrame = function(callback){
            if(window.requestAnimationFrame){
                window.requestAnimationFrame(callback);
            } else if( window.webkitRequestAnimationFrame){
                window.webkitRequestAnimationFrame(callback);
            } else if (window.mozRequestAnimationFrame){
                window.mozRequestAnimationFrame(callback);
            } else {
                window.setTimeout(callback, 1000 / 60);
            }
        };
        init();

    };
});