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
Map<String, Card> cards = new Map<String, Card>();


main(){
    container = new Container(containerElement);
    header = new Header(headerElement);
    menu = new Menu(menuElement);
    sidebar = new Sidebar(sidebarElement);

    List<Element> cardElements = querySelectorAll('.card');

    cardElements.forEach((Element cardElement){
        Card card = new Card(cardElement);
        cards[card.name] = card;
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
        if(cards.containsKey(node['node'])){

            cards.forEach((String name, Card card){
                card.contract();
            });

            if(container.isExpanded){
                cards[node['node']].expand();
            } else {
                cards['slemgrim'].onContractingEnd.listen((_){
                    cards[node['node']].expand();
                });
            }
        }

        currentNode = node['node'];

    });
}
