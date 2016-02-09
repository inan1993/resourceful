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
            this.next();
        }
    }
});

//Set default display page to dashboard
Router.route('/', {
    name: 'dashboard'
});
Router.route('addresource', {
    name: 'addresource'
});

Router.onBeforeAction(function(){
        if(Roles.userIsInRole(Meteor.user(), ['admin'])){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['users', 'addresource']
});

Router.route('/prof/:_id',{
    name: 'profile',
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
});

Router.route('/resource/:_id',{
    name: 'resource',
    data: function () {
      return Meteor.resources.findOne({_id: this.params._id});
    }
});

Router.route('/users', {
    name: 'users'
});