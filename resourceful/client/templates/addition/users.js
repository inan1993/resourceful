Template.users.events({
    'submit #create-user-form': function (event) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var emailVar = event.target.email.value;
        var passVar = event.target.password.value;
        var nameVar = event.target.name.value;
        Accounts.createUser({
            email: emailVar,
            password: passVar,
            name: nameVar
        }, function (err) {
            if (!err) {
                toastr.success("User "+ emailVar + " added!");
            } else {
                console.log(err.reason);
                toastr.error(err.reason);
            }
        });
    }
});