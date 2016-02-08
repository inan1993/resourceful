Template.createadmin.events({
    'submit #create-account-form': function (event) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var emailVar = event.target.email.value;
        var passVar = event.target.password.value;
        Meteor.call(addUser, {
            email: emailVar,
            password: passVar,
            name: "admin"
        }, function (err) {
            if (Meteor.user()) {
                Router.go('dashboard');
            } else {
                console.log(err.reason);
                toastr.error(err.reason);
            }
        });
    }
});