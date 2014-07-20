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
Header header;

main(){
    container = new Container(containerElement);
    header = new Header(headerElement);
    sidebar = new Sidebar(sidebarElement);
    menu = new Menu(menuElement);

    container.init();


    Window.animationEndEvent.forTarget(containerElement).listen((AnimationEvent evt){
        if(evt.animationName == 'anim-container'){
            header.init();
        }
    });

    sidebarToggleElement.onClick.listen((_){
        sidebar.toggle();
    });

    menu.onChangeNode.listen((Map node){
        container.showCard(node['node'], node['target'], node['rect']);
    });
}
