part of slemgrim;

class Card {

    Element element;
    Element pageWrap;

    Card(this.element){
        _init();
        pageWrap = element.querySelector('.pageWrap');
    }

    void open(){
        element.classes.add('resize');
        new Future.delayed(new Duration(milliseconds: 1000))
        .then((_){
            pageWrap.classes.toggle('z-depth-5');
        });
    }

    void _init(){
    }

}