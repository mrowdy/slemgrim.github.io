import 'dart:html';
import 'dart:async';
import 'package:slemgrim.com/slemgrim.dart';

Element containerElement = querySelector('#container');
Element headerElement = querySelector('.header');
Element menuElement = querySelector('.menu');

Container container;
Menu menu;
Header header;

main(){
    container = new Container(containerElement);
    header = new Header(headerElement);
    menu = new Menu(menuElement);

    container.init();


    Window.animationEndEvent.forTarget(containerElement).listen((AnimationEvent evt){
        if(evt.animationName == 'anim-container'){
            header.init();
        }
    });

    Window.animationStartEvent.forTarget(containerElement).listen((AnimationEvent evt){
        if(evt.animationName == 'anim-expand'){
            header.contract();
        }
        if(evt.animationName == 'anim-contract'){
            header.expand();
        }
    });

    menu.onChangeNode.listen((Map node){
        if(node['node'] != 'slemgrim'){
            container.expand();
        } else {
            container.contract();
        }

        print(node);
    });
}
