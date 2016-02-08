Template.users.events({
    'submit #create-user-form': function (event) {
        event.preventDefault();
        var user = {
            email: event.target.email.value,
            password: event.target.password.value,
            name: event.target.name.value
        }
        Meteor.call('addUser', user, function (err, result) {
            if (err) {
                toastr.error(err.reason);
            } else {
                toastr.success("Added user " + name + "!");
            }
        });
    }
});