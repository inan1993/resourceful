Template.login.helpers({

    noUsers: function () {
        if (Meteor.users.find().count()) {
            return false;
        } else {
            return true;
        }
    }
});

