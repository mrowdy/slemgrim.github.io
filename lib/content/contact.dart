part of slemgrim;

class Contact{
    Element element;
    Element submit;
    List<Element> required = new List<Element>();

    bool _isSubmitable = false;

    Contact(this.element){
        required = element.querySelectorAll('.required');
        submit = element.querySelector('.submit');
        required.forEach((Element field){
            field.onKeyUp.listen(_checkRequired);
        });
    }

    void _checkRequired(Event evt){
        int requiredLength = required.where((var el){
            return el.value.length > 0 ? false : true;
        }).length;

        if(requiredLength == 0){
            _isSubmitable = true;
        } else {
            _isSubmitable = false;
        }

        _updateForm();
    }

    void _updateForm(){
        if(_isSubmitable){
            submit.classes.add('submitable');
        } else {
            submit.classes.remove('submitable');
        }
    }
}