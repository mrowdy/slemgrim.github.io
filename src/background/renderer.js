define(['app/core'], function(core) {
    'use strict';

    return function($canvas){

        if($canvas === null){
            return false;
        }

        var context,
            world,
            i,
            particle;

        var init = function(){
            context = $canvas.getContext('2d');
            clear();
        };

        this.init = function(){
            init();
        };

        this.draw = function(world){
            clear();
            renderParticles(world.items);
        };

        var clear = function(){
            context.clearRect(0, 0, $canvas.width, $canvas.height);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, $canvas.width, $canvas.height);
        };

        var renderParticles = function(particles){
            for(i = 0; i < particles.length; i++){
                particle = particles[i];

                context.translate(particle.position.x, particle.position.y);

                drawHexagon(particle.position, particle.radius);

                context.translate(particle.position.x * -1, particle.position.y * -1);
            }
        }

        var drawHexagon = function(position, radius){
            context.fillStyle = '#ffffff';
            context.strokeStyle = "#000000";
            context.lineWidth = 1;
            context.beginPath();

            context.moveTo (radius * Math.cos(0), radius *  Math.sin(0));

            for (var i = 1; i <= 6;i += 1) {
                context.lineTo (radius * Math.cos(i * 2 * Math.PI / 6), radius * Math.sin(i * 2 * Math.PI / 6));
            }
            context.fill();
            context.closePath();
        }

        init();
    };
});