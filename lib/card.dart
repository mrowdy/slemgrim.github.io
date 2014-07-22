part of slemgrim;

class Card extends Expander{
    String name;

    Card(Element element) : super(element, 'card'){
        name = element.dataset['name'];
    }
}