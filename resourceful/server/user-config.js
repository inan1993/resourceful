Accounts.onCreateUser(function (options, user) {
    var userId = user._id = Random.id();
    console.log(Meteor.users.find().count());
    console.log('Creating New User');
    // console.log(Meteor.user().roles.indexOf("admin", 0));
    console.log(user);
    if (Meteor.users.find().count() == 0 || ( Meteor.user().roles.indexOf("admin", 0) > -1 && user.isAdmin == "true") ) {
        console.log('Creating Admin User');
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