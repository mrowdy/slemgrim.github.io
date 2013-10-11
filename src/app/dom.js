define(function() {
    'use strict';
    /* global document */

    return {
       el: function(selector, $el){
           if($el){
               return $el.querySelector(selector);
           } else {
               return document.querySelector(selector);
           }

       },

       els: function(selector, $el){
           if($el){
               return $el.querySelectorAll(selector);
           } else {
               return document.querySelectorAll(selector);
           }
       }
    };

});