part of slemgrim;

class Sidebar extends Expander{

    Sidebar(element) : super(element, 'sidebar');

    void init(){
        element.classes.add('init');
    }

    void toggle(){
        element.classes.toggle('show');
    }

    void hide(){
         element.classes.remove('show');
     }

    void show(){
         element.classes.add('show');
    }
}