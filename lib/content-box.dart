part of slemgrim;

class ContentBox extends Expander{
    String name;
    List<Card> cards = new List<Card>();

    ContentBox(Element element) : super(element, 'content-box'){
        name = element.dataset['name'];
        List<Element> cardElements = element.querySelectorAll('.card');

        cardElements.forEach((Element cardElement){
            Card card = new Card(cardElement);
            cards.add(card);
        });

        onExpandingEnd.listen((_) => initCards());
        onContractingStart.listen((_) => hideCards());
    }

    void initCards() {
        cards.forEach((Card card){
             card.expand();
        });
    }

    void hideCards(){
        cards.forEach((Card card){
             card.contract();
        });
    }
}