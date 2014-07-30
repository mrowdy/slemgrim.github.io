part of slemgrim;

class Header extends Expander{
    List<Element> keys = new List<Element>();

    Header(Element element) : super(element, 'header'){
        keys = element.querySelectorAll('.key');

        int delay = 0;

        keys.forEach((Element key){
           Duration dur = new Duration(milliseconds: delay);
           new Future.delayed(dur, (){
               key.classes.add('animated');
           });
           delay += 200;
        });

    }
}