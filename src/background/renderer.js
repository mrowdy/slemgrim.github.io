define(function() {
    'use strict';

    return function($canvas){

        if($canvas === null){
            return false;
        }

        var context,
            i = 0, y = 0,
            particle,
            opacity = 1,
            color;

        var init = function(){
            context = $canvas.getContext('2d');
            clear();
        };

        this.init = function(){
            init();
        };

        this.draw = function(world){
            clear();
            renderParticles(world.particles);
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

                opacity = 1;
                if(particle.canDie){
                    opacity = 1 / particle.ttl * particle.age;
                }
                color = 'rgba('+ particle.color.r + ', ' + particle.color.g + ', '+ particle.color.b + ', '  + opacity + ')';
                drawHexagon(particle.position, particle.radius, color);

                if(particle.background !== false){
                    color = 'rgba('+ particle.background.r + ', ' + particle.background.g + ', '+ particle.background.b + ', 1)';

                    context.translate(-1, 1);
                    drawHexagon(particle.position, particle.radius - 30, '#525252');
                    context.translate(1, -1);

                    context.translate(1, -1);
                    drawHexagon(particle.position, particle.radius - 30, '#0e0e0e');
                    context.translate(-1, 1);

                    drawHexagon(particle.position, particle.radius - 30, color);

                }

                context.translate(particle.position.x * -1, particle.position.y * -1);
            }
        }

        var drawHexagon = function(position, radius, color, shadow){
            context.fillStyle = color;
            context.strokeStyle = "#000000";
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo (radius * Math.cos(0), radius *  Math.sin(0));

            for (y = 1; y <= 6;y += 1) {
                context.lineTo (radius * Math.cos(y * 2 * Math.PI / 6), radius * Math.sin(y * 2 * Math.PI / 6));
            }

            context.fill();
            context.closePath();
        }

        init();
    };
});