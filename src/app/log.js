define(function() {
    'use strict';

    return {
        error: function($msg){
            console.log('WARNING: ' + $msg);
        },

        warn: function($msg){
            console.log('ERROR: ' + $msg);
        },

        info: function($msg){
            console.log($msg);
        }
    };

});