part of slemgrim;

abstract class Expander {

    Element element;
    String animationBase;

    bool _isExpanded = false;
    bool get isExpanded => _isExpanded;

    StreamController _onContractingStart = new StreamController.broadcast();
    StreamController _onContractingEnd = new StreamController.broadcast();
    StreamController _onExpandingStart = new StreamController.broadcast();
    StreamController _onExpandingEnd = new StreamController.broadcast();
    StreamController _onInitStart = new StreamController.broadcast();
    StreamController _onInitEnd = new StreamController.broadcast();

    Stream get onContractingStart => _onContractingStart.stream;
    Stream get onContractingEnd => _onContractingEnd.stream;
    Stream get onExpandingStart => _onExpandingStart.stream;
    Stream get onExpandingEnd => _onExpandingEnd.stream;
    Stream get onInitStart => _onInitStart.stream;
    Stream get onInitEnd => _onInitEnd.stream;

    Expander(this.element, this.animationBase){

        if(element.classes.contains('expanded')){
            _isExpanded = true;
        }

        Window.animationStartEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName.contains('anim-${animationBase}-expand')){
                element.classes.remove('contracted');
                _onExpandingStart.add(true);
            } else if(evt.animationName.contains('anim-${animationBase}-contract')){
                element.classes.remove('expanded');
                _isExpanded = false;
                _onContractingStart.add(true);
            } else if(evt.animationName.contains('anim-${animationBase}-init')){
                _onInitStart.add(true);
            }
        });

        Window.animationEndEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName.contains('anim-${animationBase}-expand')){
                element.classes.remove('expanding');
                element.classes.add('expanded');
                _isExpanded = true;
                _onExpandingEnd.add(true);
            } else if (evt.animationName.contains('anim-${animationBase}-contract')){
                element.classes.remove('contracting');
                element.classes.add('contracted');
                _onContractingEnd.add(true);
            } else if(evt.animationName.contains('anim-${animationBase}-init')){
                _onInitEnd.add(true);
            }
        });
    }

    void init(){
        element.classes.add('init');
    }

    void expand(){
        element.classes.remove('contracting');
        element.classes.add('expanding');
    }

    void contract(){
        element.classes.remove('expanding');
        element.classes.add('contracting');
    }
}