Template.users.events({
    'submit #create-user-form': function (event, template) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var emailVar = event.target.email.value;
        var passVar = event.target.password.value;
        var nameVar = event.target.name.value;
        // var adminVar = template.find('input:radio[name=isAdmin]:checked').value;
        console.log(adminVar);
        var user = {
            email: emailVar,
            password: passVar,
            name: nameVar,
            // profile: adminVar
        } 
        Meteor.call('addUser', user, function (err, result) {
            if (!err) {
                toastr.success("User "+ emailVar + " added!");
                template.find("form").reset();
            } else {
                console.log(err.reason);
            }
        });
    }
});