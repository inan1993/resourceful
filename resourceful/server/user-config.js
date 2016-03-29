Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl("enroll/" + token);
};
Accounts.onCreateUser(function (options, user) {
    var userId = user._id = Random.id();
    console.log(Meteor.users.find().count());
    if (Meteor.users.find().count() == 0) {
        var handle = Meteor.users.find({
            _id: userId
        }, {
            fields: {
                _id: 1
            }
        }).observe({
            added: function () {
                Roles.setUserRoles(userId, 'admin');
                handle.stop();
                handle = null;
            }
        });

        Meteor.setTimeout(function () {
            if (handle) {
                handle.stop();
            }
        }, 30000);
    }
    return user;
});
function rejectReservation(reservationId) {
        // ADD CODE TO SEND REJECTION EMAIL HERE
        // Then, remove the reservation
        console.log("removed " + Reservations.findOne({
            _id: reservationId
        }).name);
        Reservations.remove({
            _id: reservationId
        });
    }
Meteor.methods({
    addUser: function (userToAdd) {
        var userId = Accounts.createUser(userToAdd);
        Accounts.sendEnrollmentEmail(userId);
    },
    rejectReservation: function (reservationId) {
        rejectReservation(reservationId)
    },
    checkApprovals: function (reservationId) {
        var willApprove = true;
        var reservation = Reservations.findOne({
            _id: reservationId
        });
        for (var i = 0; i < reservation.resourceId.length; i++) {
            // if the resourceId is either unverified or is in our approvals array, we're good
            var currResource = Resources.findOne({
                _id: reservation.resourceId[i]
            });
            if (currResource.restricted) {
                console.log("restricted");
                if (reservation.approvals.length == 0 || !(_.contains(reservation.approvals, reservation.resourceId[i]))) {
                    willApprove = false;
                    console.log("Could not approve " + currResource.name);
                }
            }
            console.log("Approved " + currResource);
        }
        // if we make it to here, update reservation to approved
        if (willApprove) {
            Reservations.update({
                _id: reservationId
            }, {
                $set: {
                    approved: true
                }
            });
            // reject all competing reservations
            toCancel = Reservations.find({
                $and: [{
                        start: {
                            $lte: reservation.end
                        }
                    }, {
                        end: {
                            $gte: reservation.start
                        }
                    }, {
                        resourceId: {
                            $in: reservation.resourceId
                        }
                    }, {
                        approved: false
                    },
                    {
                        _id: {
                            $ne: reservation._id
                        }
                    }]
            }).fetch();
            toCancel = _.uniq(toCancel);
            console.log("Cancelling");
            for (var j = 0; j < toCancel.length; j++) {
                rejectReservation(toCancel[j]._id);
            }
        }
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