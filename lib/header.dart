part of slemgrim;

class Header {

    Element element;
    bool isExpanded = false;
    List<Element> nodes = new List<Element>();

    Header(this.element){
        nodes = element.querySelectorAll('.node');
        _eventBindings();
    }

    void _eventBindings(){
        Window.animationEndEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName == 'anim-header-init'){
                element.classes.add('showNavBalls');
            }
        });

        nodes.forEach((Element node){
            node.onClick.listen((MouseEvent evt){
                evt.preventDefault();
                expand();
            });
        });
    }

    void init(){
        element.classes.add('init');
    }

    void expand(){
        if(isExpanded){
            return;
        }

        element.classes.add('expand');

        isExpanded = true;
    }

    void contract(){
        if(!isExpanded){
            return;
        }

        element.classes.remove('expand');

        isExpanded = false;
    }
}