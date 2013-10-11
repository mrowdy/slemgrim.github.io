require.config({
    baseUrl: 'src'
});

require(["app/core", "background/canvas-handler", "background/background", 'email-crypt'], function(core, CanvasHandler, Background, EmailCrypt) {
    'use strict';

    var $background = core.dom.el('#background'),
        canvasHandler,
        background;

    var init = function(){
        background = new Background($background);
        canvasHandler = new CanvasHandler($background);
        canvasHandler.registerListener(background);

        var $email = core.dom.el('#hex-email a');
        new EmailCrypt($email);

    };

    init();
});