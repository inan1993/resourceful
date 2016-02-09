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
    }
    Meteor.setTimeout(function () {
        if (handle) {
            handle.stop();
        }
    }, 30000);
    return user;
});

Meteor.methods({
    addUser: function (userToAdd) {
        // FOR NOW, EVERYONE HAS PASSWORD PASSWORD.  UNCOMMENT THIS LINE TO PROMPT WITH AN EMAIL
        var userId = Accounts.createUser({
            email: userToAdd.email,
            name: userToAdd.name,
            password: "password"
        });
        // UNCOMMENT ME, PLEASE, and add logic to handle
        // Accounts.sendEnrollmentEmail(userId, [email])
    }
});

Accounts.validateNewUser(function (user) {
    var loggedInUser = Meteor.user();
    if (Roles.userIsInRole(loggedInUser, ['admin'])) {
        return true;
    }
    if (Meteor.users.find().count() == 0) {
        return true;
    }
    throw new Meteor.Error(403, "Not authorized to create new users");
});