import 'dart:html';
import 'dart:async';
import 'package:slemgrim.com/slemgrim.dart';

Element containerElement = querySelector('#container');
Element headerElement = querySelector('.header');

Element sidebarElement = querySelector('.sidebar');
Element sidebarToggleElement = querySelector('.sidebarToggle');
Element menuElement = querySelector('.menu');

Container container;
Sidebar sidebar;
Menu menu;

main(){
    containerElement.classes.add('init');
    Window.animationEndEvent.forTarget(containerElement).listen((AnimationEvent evt){
        if(evt.animationName == 'anim-container'){
            headerElement.classes.add('init');
        }
    });

    Window.animationEndEvent.forTarget(headerElement).listen((AnimationEvent evt){
        if(evt.animationName == 'anim-header-init'){
            headerElement.classes.add('showNavBalls');
        }
    });


    container = new Container(containerElement);
    sidebar = new Sidebar(sidebarElement);
    menu = new Menu(menuElement);

    new Future.delayed(new Duration(milliseconds: 500)).then((_) => sidebar.init());

    sidebarToggleElement.onClick.listen((_){
        sidebar.toggle();
    });

    menu.onChangeNode.listen((Map node){
        container.showCard(node['node'], node['target'], node['rect']);
    });
}
