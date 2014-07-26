import 'dart:html';
import 'package:slemgrim.com/slemgrim.dart';
import 'package:query_string/query_string.dart';


Element containerElement = querySelector('#container');
Element headerElement = querySelector('.header');
Element menuElement = querySelector('.menu');
Element sidebarElement = querySelector('.sidebar');
Element toggle = querySelector('.toggle');
Element contactElement = querySelector('.contact');

Container container;
Menu menu;
Header header;
Sidebar sidebar;
String currentNode = 'slemgrim';
Map<String, ContentBox> contentBoxes = new Map<String, ContentBox>();

bool isAnimation = false;

Contact contact;

main(){
    container = new Container(containerElement);
    header = new Header(headerElement);
    menu = new Menu(menuElement);
    sidebar = new Sidebar(sidebarElement);
    contact = new Contact(contactElement);

    List<Element> contentBoxElements = querySelectorAll('.content-box');

    contentBoxElements.forEach((Element contentBoxElement){
        ContentBox contentBox = new ContentBox(contentBoxElement);
        contentBoxes[contentBox.name] = contentBox;
    });

    container..init()
             ..onInitEnd.listen((_) => initSite())
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
        sidebar.hide();
        currentNode = node['node'];

        window.history.pushState(
            null,
            currentNode,
            window.location.pathname + '?page=' + currentNode
        );

    });

}

void initSite(){
    String query = window.location.search;
    Map queryData = QueryString.parse(query);
    String page = queryData['page'];

    if(page != null && page != 'slemgrim' && contentBoxes.containsKey(page)){
        menu.open(page);
    }
}
