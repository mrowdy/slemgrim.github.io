define(['app/core', 'background/vector2'], function(core, Vector2) {
    'use strict';

    return  function(actor1, actor2, constant, damping, length) {

        this.constant = constant;
        this.damping = damping;
        this.length = length;
        this.actor1 = actor1;
        this.actor2 = actor2;
        this.on = true;

        var a2b = new Vector2(),
            va2b = new Vector2(),
            fspring = 0,
            fdamping = 0,
            fr = 0,
            d = 0;

        this.update = function() {
            if (!(this.on && (!this.actor1.statoc || !this.actor2.static))){
                return this;
            }

            a2b = a2b.copyFrom(this.actor1.position).sub(this.actor2.position);
            d = a2b.len();

            if (d === 0) {
                a2b.clear();
            } else {
                a2b.div(d);
            }

            fspring = -1 * (d - this.length) * this.constant;

            va2b = va2b.copyFrom(this.actor1.velocity).sub(this.actor2.velocity);

            fdamping = -1 * this.damping * va2b.dot(a2b);

            fr = fspring + fdamping;

            a2b.mul(fr);

            if (!actor1.static) {
                //actor1.addForce(a2b);
            }
            if (!this.actor2.static) {
                this.actor2.addForce(a2b.reverse());
            }

            return this;
        };

        this.resting = function() {
            return (
                !this.on
                || (this.actor1.static && this.actor2.static)
                || (this.actor1.static && (this.length === 0 ? this.actor2.position.equals(this.actor1.position) : this.actor2.position.distance(this.actor1.position) <= this.length) && this.actor2.resting())
                || (this.actor2.static && (this.length === 0 ? this.actor1.position.equals(this.actor2.position) : this.actor1.position.distance(this.actor2.position) <= this.length) && this.actor1.resting())
            );

        };
    };
});