define(
    [
        'app/core',
        'background/vector2',
        'background/particle',
    ],
    function(core, Vector2, Particle) {
        'use strict';

        return function(width, height){

            this.size = new Vector2(width, height);
            this.cellSize= 50;
            this.gravity = new Vector2(0, 0);
            this.roundOver = true;
            this.round = 1;

            this.items = [];

            var instance = this;

            var deltaG = new Vector2(),
                item,
                i;

            this.initWorld = function(){
                this.items = [];
                item = new Particle(Math.random() * this.size.x, Math.random() * this.size.y, 100);
                this.items.push(item);

            };

            this.update = function(deltaTime){
                deltaG.copyFrom(this.gravity);
                deltaG.mul(deltaTime);
                for(var i = 0; i < this.items.length; i++){
                    item = this.items[i];
                    item.update(deltaTime);
                    addGravity(item, deltaG);
                }
            };

            var addGravity = function(item, deltaG){
                if(item.affectedByGravity){
                    item.addForce(deltaG);
                }
            };

            var removeItem = function(item){
                i = instance.items.indexOf(item);
                instance.items.splice(i, 1);
            };
        };
});