Router.configure({
    layoutTemplate: 'layout'
});

//Set default display page to dashboard
Router.route('/', {
    name: 'dashboard'
});
Router.route('add', {
    name: 'addresource'
});

Router.onBeforeAction(function(){
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
    }, {
  except: ['enroll']
});

Router.onBeforeAction(function(){
        if(Roles.userIsInRole(Meteor.user(), ['admin','userManager'])){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['groupslist']
});

Router.onBeforeAction(function(){
        if(Meteor.users.findOne({_id: this.params._id})){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['profile']
});

Router.onBeforeAction(function(){
        if(Resources.findOne({_id: this.params._id})){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['resource']
});

Router.onBeforeAction(function(){
        if(Roles.userIsInRole(Meteor.user(), ['admin','resourceManager'])){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['editresource']
});

Router.onBeforeAction(function(){
        if(Roles.userIsInRole(Meteor.user(), ['admin','user'])){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['reservation']
});

Router.onBeforeAction(function(){
        if(Reservations.findOne({_id: this.params._id})){
            this.next();
        }
        else{
            this.render('forbidden');
        }
    }, {
  only: ['reservation']
});

Router.route('/prof/:_id',{
    name: 'profile',
    data: function () {
      return Meteor.users.findOne({_id: this.params._id});
    }
});

Router.route('/groups/',{
    name: 'groupslist'
});

Router.route('/resource/:_id',{
    name: 'resource',
    data: function () {
      return Resources.findOne({_id: this.params._id});
    }
});

Router.route('/group/:_id',{
    name: 'editgroup',
    data: function () {
      return Groups.findOne({_id: this.params._id});
    }
});

Router.route('/reservation/:_id',{
    name: 'reservation',
    data: function () {
      return Reservations.findOne({_id: this.params._id});
    }
});

Router.route('/resource/:_id/edit', {
    name: 'editresource',
    data: function () {
      return Resources.findOne({_id: this.params._id});
    }
});

Router.route('/users', {
    name: 'users'
});

Router.route('enroll', {
    onBeforeAction: function() {
      Meteor.logout();
      Session.set('_resetPasswordToken', this.params.token);
      this.subscribe('enrolledUser', this.params.token).wait();
      this.next();
    },
    path: '/enroll/:token',
    template: 'enrollaccount',
    data: function() {
      if(this.ready()) {
        return {
          enrolledUser: Meteor.users.find()
        };
      }
    }
  });