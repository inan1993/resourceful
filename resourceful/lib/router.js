Router.configure({
    layoutTemplate: 'layout',
    onBeforeAction: function () {
        if (!Meteor.user()) {
            if(Meteor.users.find().count() == 0){
                this.render('createadmin');
            }
            else{
                this.render('landingpage');
            }
        } else {
            console.log("not render");
            this.next();
        }
    }
});

Router.route('/', {
    name: 'dashboard'
});


Router.onBeforeAction(function(){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['users']
});


Router.route('/users', {
    name: 'users'
});