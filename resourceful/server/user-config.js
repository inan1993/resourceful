Accounts.onCreateUser(function (options, user) {
    var userId = user._id = Random.id();
    console.log(Meteor.users.find().count());
    if (Meteor.users.find().count() == 0) {
    var handle = Meteor.users.find({_id: userId}, {fields: {_id: 1}}).observe({
        added: function () {
            Roles.setUserRoles(userId, 'admin');
            handle.stop();
            handle = null;
        }
    });
        
    Meteor.setTimeout(function() {
        if (handle) {
            handle.stop();
        }
    }, 30000);
    }
    return user;
});




