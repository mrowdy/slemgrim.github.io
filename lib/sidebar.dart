part of slemgrim;

class Sidebar {

    Element element;

    Sidebar(this.element){
        _eventBindings();
    }

    void _eventBindings(){

    }

    void init(){
        element.classes.add('init');
    }

    void toggle(){
        element.classes.toggle('show');
    }

}