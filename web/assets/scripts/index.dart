import 'dart:html';
import 'dart:async';
import 'package:slemgrim.com/slemgrim.dart';

Element container = querySelector('#container');
Element sidebar = querySelector('.sidebar');
Element sidebarToggle = querySelector('.sidebarToggle');

main(){

    container.classes.add('init');

    new Future.delayed(new Duration(milliseconds: 500)).then(initSidebar);

    sidebarToggle.onClick.listen((_){
        print('click');
        sidebar.classes.toggle('show');
    });
}

void initSidebar(Future future){
    sidebar.classes.add('init');
}