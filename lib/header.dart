part of slemgrim;

class Header {

    Element element;

    Header(this.element){
        Window.animationStartEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName == 'anim-header-expand'){
                element.classes.remove('contracted');
            }
        });

        Window.animationEndEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName == 'anim-header-contract'){
                element.classes.add('contracted');
            }
        });
    }

    void init(){
        element.classes.add('init');
    }

    void expand(){
        element.classes.remove('contract');
        element.classes.add('expand');
    }

    void contract(){
        element.classes.remove('expand');
        element.classes.add('contract');
    }
}