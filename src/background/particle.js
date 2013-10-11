define(['app/core', 'background/vector2', 'background/spring'], function(core, Vector2, Rectangle, Spring) {
    'use strict';

    return function(x, y, radius){

        this.TYPE = 'SNAKE';
        this.radius = radius;

        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);

        this.speed = 3;
        this.growth = 1.001;
        this.friction = 0.000;
        this.affectedByGravity = false;

        var acceleration = new Vector2();

        this.update = function(deltaTime){
            this.radius /= this.growth;
            if(this.radius <= 1){
                this.radius = radius;
            }

            acceleration = acceleration.copyFrom(this.velocity);
            acceleration.mul(this.speed * deltaTime);
            this.position.add(acceleration);
            this.velocity.mul( 1 - this.friction);
        };

        this.addForce = function(v){
            this.velocity.add(v);
        };

    };
});