import 'dart:html';
import 'package:slemgrim.com/slemgrim.dart';

main(){
    Element contact = querySelector('.contact');
    Element contactButton = querySelector('.bContact');

    if(contact != null){
        Card contactCard = new Card(contact);
        contactButton.onClick.listen((_) => contactCard.open());
    }
}