var groupHooks = {
    before: {
        insert: function (doc) {
            for (var i = 0; i < doc.members.length; i++) {
                var user = Meteor.users.findOne({
                    'emails.address': doc.members[i]
                });
                if (user) {
                    if (doc.resourceManagers) {
                        Meteor.call('makeResourceManager', user, function (error, result) {
                            if (error) {
                                toastr.error(doc.members[i] + " could not be made a Resource Manager!");
                            } 
                        });
                    }
                    if (doc.userManagers) {
                        Meteor.call('makeUserManager', user, function (error, result) {
                            if (error) {
                                toastr.error(doc.members[i] + " could not be made a User Manager!");
                            } 
                        });
                    }
                     if (doc.reservationManagers) {
                        Meteor.call('makeReservationManager', user, function (error, result) {
                            if (error) {
                                toastr.error(doc.members[i] + " could not be made a Reservation Manager!");
                            } 
                        });
                    }
                } else {
                    toastr.error(doc.members[i] + " is not a valid email!");
                    return false;
                }
            }
            return doc;
        }
    }
}

AutoForm.addHooks('insertGroupForm', groupHooks);

Template.groupslist.helpers({
    getGroups: function () {
        return Groups.find({}).fetch();
    }
});
Template.groupslist.events({
    'click .list-group-item': function (event) {
        event.preventDefault();
        console.log(this._id);
        Router.go('editgroup', {
            _id: this._id
        });
    }
});
