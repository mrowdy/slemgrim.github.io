import 'dart:html';
import 'package:slemgrim.com/slemgrim.dart';

Element containerElement = querySelector('#container');
Element headerElement = querySelector('.header');
Element menuElement = querySelector('.menu');
Element sidebarElement = querySelector('.sidebar');
Element toggle = querySelector('.toggle');

Container container;
Menu menu;
Header header;
Sidebar sidebar;
String currentNode = 'slemgrim';
Map<String, ContentBox> contentBoxes = new Map<String, ContentBox>();


main(){
    container = new Container(containerElement);
    header = new Header(headerElement);
    menu = new Menu(menuElement);
    sidebar = new Sidebar(sidebarElement);

    List<Element> contentBoxElements = querySelectorAll('.contentBox');

    contentBoxElements.forEach((Element contentBoxElement){
        ContentBox contentBox = new ContentBox(contentBoxElement);
        contentBoxes[contentBox.name] = contentBox;
    });

    container..init()
             ..onExpandingStart.listen((_)   => header.contract())
             ..onExpandingStart.listen((_)   => sidebar.contract())
             ..onContractingStart.listen((_) => header.expand())
             ..onContractingStart.listen((_) => sidebar.expand());

    toggle.onClick.listen((_) => sidebar.toggle());

    menu.onChangeNode.listen((Map node){
        if(currentNode == node['node']){
            return;
        }
        if(node['node'] != 'slemgrim'){
            if(!container.isExpanded){
                container.expand();
            }
        } else {
            if(container.isExpanded){
                container.contract();
            }
        }
        if(contentBoxes.containsKey(node['node'])){

            contentBoxes.forEach((String name, ContentBox contentBox){
                contentBox.contract();
            });

            if(container.isExpanded){
                contentBoxes[node['node']].expand();
            } else {
                contentBoxes['slemgrim'].onContractingEnd.listen((_){
                    contentBoxes[node['node']].expand();
                });
            }
        }

        currentNode = node['node'];

    });
}
