require.config({
    baseUrl: 'src'
});

require(["app/core", "background/canvas-handler", "background/background"], function(core, CanvasHandler, Background) {
    'use strict';

    var $background = core.dom.el('#background'),
        canvasHandler,
        background;

    var init = function(){
        background = new Background($background);
        canvasHandler = new CanvasHandler($background);
        canvasHandler.registerListener(background);
    };

    init();
});