part of slemgrim;

class Container {

    Element element;
    Element content;

    Container(this.element){
        content = element.querySelector('.content');

        Window.animationEndEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName == 'anim-expand'){
                element.classes.add('expanded');
            }
        });

        Window.animationStartEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName == 'anim-contract'){
                element.classes.remove('expanded');
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