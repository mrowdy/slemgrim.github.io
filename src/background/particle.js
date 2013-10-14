define(['app/core', 'background/vector2', 'background/spring'], function(core, Vector2, Rectangle, Spring) {
    'use strict';

    return function(x, y, radius, element, rotationSpeed){

        this.TYPE = 'PARTICLE';
        this.radius = radius;
        this.element = element;

        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.rotationSpeed = rotationSpeed || 0;

        this.ttl = false;
        this.speed = 0.2;
        this.friction = 0.000;
        this.dead = false;
        this.age = 0;
        this.canDie = false;
        this.color = {
            r: 0,
            g: 138,
            b: 25
        };

        if(element){
            core.classlist.add(element, 'animated');
        }

        this.background = false;

        var acceleration = new Vector2();

        this.update = function(deltaTime){
            acceleration = acceleration.copyFrom(this.velocity);
            acceleration.mul(this.speed * deltaTime);
            this.position.add(acceleration);
            this.velocity.mul( 1 - this.friction);

            if(this.element){
                this.element.style.top = this.position.y - this.radius/2 + 'px';
                this.element.style.left = this.position.x - this.radius/2 + 'px';
            }


            if(this.canDie !== false && this.dead === false){
                this.age += deltaTime;
                if(this.age >= this.ttl){
                    this.dead = true;
                }
            }
        };

        this.addForce = function(v){
            this.velocity.add(v);
        };

    };
});