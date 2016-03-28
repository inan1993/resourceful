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

Router.route('oauth', {
    name: 'oauth'
});


Router.onBeforeAction(function(){
     //take everything after the hashtag, which contains access_token that will be exchanged for netid
     var hash = this.params.hash;
     

     if(hash != null){

     hashsplit = hash.split("&", 1).toString();
     token = hashsplit.split("=");
     token = token[1];
     console.log(token);

     var res = '';
     //getNetid defined in oauthserver.js
     
     try{
      Meteor.call("getNetid", token, function(error, result){

        res = result;
        console.log("result " + res);
      

      }
        );

      
    } catch(e){
      console.log(e);
    }


/*
      Meteor.loginWithPassword(res, token, function (err) {
            console.log("was called with "+ res + token);
            if (Meteor.user()) {
                console.log("logged");
                Router.go('');
            } else {
                console.log(err.reason);
                toastr.error(err.reason);
            }

          });

*/

     this.next();
   } else {

    console.log("hash is null");
    this.render('landingpage');
   }



    }, {
  only: ['oauth']
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
        if(_.contains(Resources.findOne(Router.current().params._id).cannotView, Meteor.user().emails[0].address)) {
             this.render('forbidden');
        }
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
// FIX THIS
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