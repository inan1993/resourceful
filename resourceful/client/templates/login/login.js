Template.login.events({
    'submit #login-form': function (event) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var emailVar = event.target.email.value;
        var passVar = event.target.password.value;
        Meteor.loginWithPassword(emailVar, passVar, function (err) {
            console.log("was called");
            if (Meteor.user()) {
                console.log("logged");
                Router.go('/');
            } else {
                console.log(err.reason);
                toastr.error(err.reason);
            }
        });
    },

    'click #logout-button': function (event) {
        console.log("logging out");
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});