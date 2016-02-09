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
            email: event.target.email.value,
        }
        Meteor.call('addUser', user, function (err, result) {
            if (!err) {
                ttoastr.success("Added user!");
                toastr.warning("They should check their email to enroll!");
                template.find("form").reset();
            } else {
                console.log(err.reason);
                toastr.error(err.reason);
            }
        });
    }
});