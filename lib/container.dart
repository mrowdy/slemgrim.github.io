part of slemgrim;

class Container {

    Element element;
    Element content;
    Map<String, Card> cards = new Map<String, Card>();


    Container(this.element){
        content = element.querySelector('.content');
        List cardElements = element.querySelectorAll('.card');
        cardElements.forEach((Element cardElement){
            Card card = new Card(cardElement);
            cards[card.name] = card;
        });
    }

    void showCard(String name, String target, Rectangle rect){

        if(!cards.containsKey(name)){
            Card card = new Card.create(name);
            cards[name] = card;
            content.append(card.element);
        }

        cards.forEach((String name, Card card){
            card.close();
        });

        Card card = cards[name];
        card.open(rect);
    }
}