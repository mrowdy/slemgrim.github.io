define(function() {
    'use strict';

    return {
        add: function add($el, eventType, handler) {
            if($el == null){
                return;
            }
            if ($el.addEventListener) {
                $el.addEventListener(eventType, handler, false);
            } else if ($el.attachEvent) {
                $el.attachEvent('on' + eventType, handler);
            } else {
                $el['on' + eventType] = handler;
            }
        },

        remove: function($el, eventType){
            /* TODO remove event listener */
            console.log('remove');
        },

        preventDefault: function(evt){
            evt.preventDefault();
        }
    };
});