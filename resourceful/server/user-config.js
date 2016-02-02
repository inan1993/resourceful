Accounts.onCreateUser(function (options, user) {
    // Semantics for adding things to users after the user document has been inserted
    var userId = user._id = Random.id();
    if (Meteor.users.find().count() == 1) {
    var handle = Meteor.users.find({_id: userId}, {fields: {_id: 1}}).observe({
        added: function () {
            Roles.addUsersToRoles(userId, ['admin']);
            handle.stop();
            handle = null;
        }
    });

    // In case the document is never inserted
    Meteor.setTimeout(function() {
        if (handle) {
            handle.stop();
        }
    }, 30000);
    }
    return user;
});