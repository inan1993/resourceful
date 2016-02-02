if (Meteor.isClient) {
    

Template.login.events({
    'submit #login-form': function (event) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var emailVar = event.target.email.value;
        var passVar = event.target.password.value;
        Accounts.createUser({
            email: emailVar,
            password: passVar
        }, function (err) {
            console.log("was called");
            if (err) {
                console.log(err.reason);
                throw new Meteor.Error("Login failed");
            } else {
                console.log("logged");
            }
        });
    }
});


Template.dashboard.events({
    'click #logout-button': function (event) {
        console.log("logging out");
        event.preventDefault();
        Meteor.logout();
    }
});
}