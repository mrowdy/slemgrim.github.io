part of slemgrim;

class Contact{
    FormElement element;
    Element submit;
    Element success;
    Element rocket;
    List<Element> required = new List<Element>();

    bool _isSubmitable = false;

    Contact(this.element){
        required = element.querySelectorAll('.required');
        submit = element.querySelector('.submit');
        success = element.querySelector('.success');
        rocket = element.querySelector('.rocket');

        required.forEach((Element field){
            field.onKeyUp.listen(_checkRequired);
        });

        element.onSubmit.listen(_submit);
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

    void _submit(Event evt){
       evt.preventDefault();
       Map data = new Map();
       required.forEach((var field){
        data[field.attributes['name']] = field.value;
       });

       Uri uri = new Uri(path: 'contact', queryParameters: data);
       Future request = HttpRequest.getString(uri.toString());
       rocket.classes.add('fly');
       success.classes.add('show');
       _isSubmitable = false;
       _updateForm();
    }
}