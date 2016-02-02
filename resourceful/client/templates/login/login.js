Template.login.helpers({

    noUsers: function () {
        if (Meteor.users.find().count()) {
            return false;
        } else {
            return true;
        }
    }
});

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
                                toastr.options = {
                                    "positionClass": "toast-bottom-right",
                                }
                                    toastr.error(err.reason);

                                }
                            });
                    },

                    'click #logout-button': function (event) {
                        console.log("logging out");
                        event.preventDefault();
                        Meteor.logout();
                    }
            });