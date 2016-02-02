Router.configure({
    layoutTemplate: 'layout',
    onBeforeAction: function () {
        if (!Meteor.user()) {
            console.log("Rendering");
            this.render('login');
        } else {
            console.log("not render");
            this.next();
        }
    }
});

Router.route('/', {
    name: 'dashboard'
});