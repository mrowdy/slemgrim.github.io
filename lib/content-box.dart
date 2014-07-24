part of slemgrim;

class ContentBox extends Expander{
    String name;

    ContentBox(Element element) : super(element, 'content-card'){
        name = element.dataset['name'];
    }
}