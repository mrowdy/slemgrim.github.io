import 'dart:html';
import 'dart:async';
import 'package:slemgrim.com/slemgrim.dart';

Element container = querySelector('#container');
Element sidebar = querySelector('.sidebar');

main(){

    container.classes.add('init');

    new Future.delayed(new Duration(milliseconds: 500)).then(initSidebar);
}

void initSidebar(Future future){
    sidebar.classes.add('init');

}