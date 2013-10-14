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
            this.round = 1;
            this.items = [];
            this.particles = [];

            var instance = this,
                item,
                i,
                angle = 0,
                center,
                github,
                twitter,
                xing,
                email,
                rot = 0.8,
                wait = false,
                timeToWait = 30;

            this.initWorld = function(){
                this.items = [];
                center = new Particle(this.size.x / 2, this.size.y / 2, 100, core.dom.el('#hex-center'));

                github = new Particle(this.size.x / 2, this.size.y / 2, 100, core.dom.el('#hex-github'));
                email = new Particle(this.size.x / 2, this.size.y / 2, 100, core.dom.el('#hex-email'));
                twitter = new Particle(this.size.x / 2, this.size.y / 2, 100, core.dom.el('#hex-twitter'));
                xing = new Particle(this.size.x / 2, this.size.y / 2, 100, core.dom.el('#hex-xing'));

                github.position.y += 210;
                xing.position.y += 210;
                email.position.y += 210;
                twitter.position.y += 210;

                github.position.rotateAround(center.position, 360/6 * (Math.PI/180));
                xing.position.rotateAround(center.position, 360/6*2 * (Math.PI/180));
                twitter.position.rotateAround(center.position, 360/6*4 * (Math.PI/180));
                email.position.rotateAround(center.position, 360/6*5 * (Math.PI/180));

                this.items.push(center);
                this.items.push(github);
                this.items.push(email);
                this.items.push(twitter);
                this.items.push(xing);

                for(i = 0; i < 100; i++){
                    createParticle();
                }

                this.particles[0].color = {
                    r: 200,
                    g: 0,
                    b: 0
                }
                this.particles[1].color = {
                    r: 200,
                    g: 0,
                    b: 0
                }
                this.particles[2].color = {
                    r: 200,
                    g: 0,
                    b: 0
                }

                for(i = 0; i < this.items.length; i++){
                    item = this.items[i];
                    item.color = {
                        r: 42,
                        g: 42,
                        b: 42
                    }

                    if(item === center){
                        continue;
                    }

                    item.background = {
                        r: 56,
                        g: 56,
                        b: 56
                    }
                }
            };

            var createParticle = function(){
                item = new Particle(instance.size.x / 2, instance.size.y / 2, Math.random() * 30, false, Math.random() * -3);
                item.velocity.x = (Math.random() * 20) - 10;
                item.velocity.y = (Math.random() * 20) - 10;
                item.ttl = Math.random() * 500;
                item.canDie = true;
                instance.particles.push(item);
            }

            var reuseParticle = function(particle){
                particle.position.reset(instance.size.x / 2, instance.size.y / 2);
                particle.radius = Math.random() * 30;
                particle.velocity.x = (Math.random() * 20) - 10;
                particle.velocity.y = (Math.random() * 20) - 10;
                particle.age = 0;
                particle.ttl = Math.random() * 500;
                particle.dead = false;
            }

            this.update = function(deltaTime){
                for(var i = 0; i < this.items.length; i++){
                    item = this.items[i];
                    item.update(deltaTime);
                }

                for(var i = 0; i < this.particles.length; i++){
                    item = this.particles[i];
                    if(item.dead === true){
                        reuseParticle(item);
                        continue;
                    }

                    item.position.rotateAround(center.position, item.rotationSpeed *deltaTime * (Math.PI/180));
                    item.update(deltaTime);
                }


                if(angle <= 60){
                    angle += rot*deltaTime;
                    twitter.position.rotateAround(center.position, rot*deltaTime * (Math.PI/180));
                    xing.position.rotateAround(center.position, rot*deltaTime * (Math.PI/180));
                    email.position.rotateAround(center.position, rot*deltaTime * (Math.PI/180));
                    github.position.rotateAround(center.position, rot*deltaTime * (Math.PI/180));
                } else {
                    if(wait === false){
                        wait = timeToWait;
                    }
                    wait -= deltaTime;
                    if(wait <= 0){
                        angle = 0;
                    }
                }

            };

        };
});