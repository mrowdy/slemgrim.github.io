import 'dart:html';
import 'package:slemgrim.com/slemgrim.dart';

Element containerElement = querySelector('#container');
Element headerElement = querySelector('.header');
Element menuElement = querySelector('.menu');
Element sidebarElement = querySelector('.sidebar');

Container container;
Menu menu;
Header header;
Sidebar sidebar;

main(){
    container = new Container(containerElement);
    header = new Header(headerElement);
    menu = new Menu(menuElement);
    sidebar = new Sidebar(sidebarElement);

    container..init()
             ..onExpandingStart.listen((_)   => header.contract())
             ..onExpandingStart.listen((_)   => sidebar.contract())
             ..onContractingStart.listen((_) => header.expand())
             ..onContractingStart.listen((_) => sidebar.expand());

    menu.onChangeNode.listen((Map node){
        if(node['node'] != 'slemgrim'){
            if(!container.isExpanded){
                container.expand();
            }
        } else {
            if(container.isExpanded){
                container.contract();
            }
        }
    });
}
