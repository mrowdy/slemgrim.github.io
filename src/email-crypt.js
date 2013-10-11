define(['app/core'], function(core){
    'use strict';

    return function($el){

        var encrypted = false;

        var init = function(){
            clickBindings();
        }

        var clickBindings = function(){
            if($el){
                core.event.add($el, 'click', onClick);
            }
        }

        var onClick = function(evt){
            if(encrypted === false){
                var email = encrypt(this.getAttribute("href"));
                this.setAttribute("href", email);
                encrypted = true;
            }
        }

        var encrypt = function(value){
            var n = 0;
            var r = "";
            for( var i = 0; i < value.length; i++)
            {
                n = value.charCodeAt( i );
                if( n >= 8364 )
                {
                    n = 128;
                }
                r += String.fromCharCode( n - 1 );
            }
            return r;
        }

        init();
    };

});