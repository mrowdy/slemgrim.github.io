part of slemgrim;

class Card {

    Element element;
    String name;
    bool isLoaded = false;

    StreamController _onOpen = new StreamController();
    Stream<Element> get onOpen => _onOpen.stream;

    Card(this.element){
        name = element.dataset['name'];
        isLoaded = true;
    }

    Card.create(this.name){
        element = document.createElement('ARTICLE');
        element.classes.add('card');
        element.dataset['name'] = name;

        Element heading = document.createElement('H1');
        heading.innerHtml = name.toString();
        element.append(heading);
    }

    void close(){
        element.classes.remove('open');
        element.classes.add('close');
    }

    void open(Rectangle rect){
        _load().then((_){
            element..style.top = '${rect.top}px'
                   ..style.left = '${rect.left}px'
                   ..style.width = '${rect.width}px'
                   ..style.height = '${rect.height}px'

            ..classes.remove('close')
            ..classes.add('open');

            Window.animationEndEvent.forTarget(element).listen((_){
                element..style.top = '0'
                       ..style.left = '300px'
                       ..style.width = '100%'
                       ..style.height = 'auto';
            });

            _onOpen.add(element);
        });
    }

    Future _load(){
        Completer compl = new Completer();
        if(isLoaded){
            compl.complete();
        } else {
            compl.complete();
            isLoaded = true;
            //todo: load data;
        }
        return compl.future;
    }
}