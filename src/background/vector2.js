define(function() {
    'use strict';

    return function(x, y){

        var sn, cs, x, y, d;

        if(typeof x === 'object'){
            this.x = x.x || 0;
            this.y = x.y || 0;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }


        this.reset = function(x, y ) {
            this.x = x;
            this.y = y;
            return this;
        };

        this.clear = function(x, y){
            this.x = 0;
            this.y = 0;
        };

        this.copyTo = function(v) {
            v.x = this.x;
            v.y = this.y;
            return this;
        };

        this.copyFrom = function(v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };

        this.add = function(v){
            this.x += v.x;
            this.y += v.y;
            return this;
        };

        this.sub = function(v){
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };

        this.mul = function(v){
            if(typeof v === 'object'){
                this.x *= v.x;
                this.y *= v.y;
            } else {
                this.x *= v;
            }   this.y *= v;

            return this;
        };

        this.div = function(v){
            if(typeof v === 'object'){
                this.x /= v.x;
                this.y /= v.y;
            } else {
                this.x /= v;
            }   this.y /= v;

            return this;
        };

        this.perp = function(){
            x = this.x;
            this.x = this.y;
            this.y = -x;
            return this;
        };

        this.reverse = function(){
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };

        this.nor = function(){
            d = this.len();
            if(d > 0) {
                this.x = this.x / d;
                this.y = this.y / d;
            }
            return this;
        };

        this.scale = function(x, y){
            this.x *= x;
            this.y *= y || x;
            return this;
        };

        this.project = function(v){
            var amt = this.dot(v) / v.len2();
            this.x = amt * v.x;
            this.y = amt * v.y;
            return this;
        };

        this.projectN = function(v){
            var amt = this.dot(v);
            this.x = amt * v.x;
            this.y = amt * v.y;
            return this;
        };

        this.reflect = function(axis){
            x = this.x;
            y = this.y;
            this.project(axis).scale(2);
            this.x -= x;
            this.y -= y;
            return this;
        };

        this.reflectN = function(axis){
            x = this.x;
            y = this.y;
            this.projectN(axis).scale(2);
            this.x -= x;
            this.y -= y;
            return this;
        };

        this.dot = function(v){
            return this.x * v.x + this.y * v.y;
        };

        this.len2 = function(){
            return this.dot(this);
        };

        this.len = function(){
            return Math.sqrt(this.len2());
        };

        this.distance = function(v){
            var len = this.sub(v).len();
            this.add(v);
            return len;
        };

        this.equals = function(v){
            return (this.x === v.x && this.y === v.y);
        };

        this.isZero = function() {
            return (this.len() < 0.0001 );
        };

        this.angleTo = function(v){
            return Math.atan2(v.y - this.y, v.x - this.x);
        };

        this.rotate = function(rad){
            sn = Math.sin(rad);
            cs = Math.cos(rad);

            x = this.x * cs - this.y * sn;
            y = this.x * sn + this.y * cs;

            this.x = x;
            this.y = y;

            return this;
        };

        this.rotateAround = function(v, rad){
            sn = Math.sin(rad);
            cs = Math.cos(rad);
            x = this.x - v.x;
            y = this.y - v.y;

            this.x = x*cs + y*sn + v.x;
            this.y = -x*sn + y*cs + v.y;
            return this;
        }
    };
});