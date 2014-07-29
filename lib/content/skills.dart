part of slemgrim;

class Skills extends Content{

    Element element;
    List<Element> skills;

    Skills(this.element){
        skills = element.querySelectorAll('.skill');
    }

    @override
    void init(){
        skills.forEach((Element skill){
            skill.classes.add('init');
        });
    }
}