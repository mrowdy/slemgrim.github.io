part of slemgrim;

abstract class Expander {

    Element element;
    String animationBase;

    bool _isExpanded = false;
    bool _isExpanding = false;
    bool _isContracting = false;

    bool get isExpanded => _isExpanded;
    bool get isExpanding => _isExpanding;
    bool get isContracting => _isContracting;
    bool get inProgress => _isContracting || _isExpanding;

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
                _isExpanding = true;
                _onExpandingStart.add(true);
            } else if(evt.animationName.contains('anim-${animationBase}-contract')){
                element.classes.remove('expanded');
                _isExpanded = false;
                _isContracting = true;
                _onContractingStart.add(true);
            } else if(evt.animationName.contains('anim-${animationBase}-init')){
                _onInitStart.add(true);
            }
        });

        Window.animationEndEvent.forTarget(element).listen((AnimationEvent evt){
            if(evt.animationName.contains('anim-${animationBase}-expand')){
                element.classes.remove('expanding');
                element.classes.add('expanded');
                _isExpanding = false;
                _isExpanded = true;
                _onExpandingEnd.add(true);
            } else if (evt.animationName.contains('anim-${animationBase}-contract')){
                _isContracting = false;
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
        if(_isExpanded){
            return;
        }
        element.classes.remove('contracting');
        element.classes.add('expanding');
    }

    void forceContract(){
        _isContracting = true;
        element.classes.remove('contracing');
        element.classes.remove('expanding');
        element.classes.remove('expanded');
        element.classes.add('contracted');
        _onContractingEnd.add(true);
    }

    void contract(){
        if(!_isExpanded){
            return;
        }
        element.classes.remove('expanding');
        element.classes.add('contracting');
    }
}