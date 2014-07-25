part of slemgrim;

class Menu {

    Element element;
    List<AnchorElement> nodes = new List<AnchorElement>();

    StreamController _onChangeNode = new StreamController();
    Stream get onChangeNode => _onChangeNode.stream;

    Menu(this.element){
        nodes = element.querySelectorAll('.node');
        _eventBindings();
    }

    void _eventBindings(){
        nodes.forEach((AnchorElement node){
            node.onClick.listen(_onNodeClick);
        });
    }

    void _onNodeClick(Event evt){
        evt.preventDefault();
        AnchorElement target = evt.target;

        if(!nodes.contains(target)){
            return;
        }

        nodes.forEach((AnchorElement node){
            node.classes.remove('active');
        });

        target.classes.add('active');
        _onChangeNode.add({
            'node': target.dataset['node'],
            'target': target.href
        });
    }

    void open(String node){
        List<AnchorElement> elements = nodes.where((AnchorElement element){
            if(element.dataset['node'] == node){
                return true;
            }
            return false;
        }).toList();

        if(elements.length > 0){
            new Future.delayed(new Duration(seconds: 1), () => elements.first.click());

        }
    }
}