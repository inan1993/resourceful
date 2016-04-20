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
        var reservation = Reservations.findOne({_id: reservationId});
        Email.send({
            from: "team@resourceful.com",
            to: reservation.email,
            subject: "Reservation Rejected",
            text: "Hello, We are sorry to inform you that your requested reservation on a restricted resource has been rejected."
        });
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
            
            // reject all competing reservations, if num reservations now greater than allowed
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
                    }
               ]
            }).fetch();
            
            toCancel = _.uniq(toCancel);
            console.log("Cancelling");
            for (var j = 0; j < toCancel.length; j++) {
                shouldCancel = false;
                
                for(var k = 0; k < toCancel[j].resourceId.length; k++){
                    currId = toCancel[j].resourceId[k];
                    // Check if this resource is either 
                    res = Resources.findOne({currId});
                    reservationCount = Reservations.find({
                    $and: [{
                        start: {
                            $lte: toCancel[j].end
                        }
                    }, {
                        end: {
                            $gte: toCancel[j].start
                        }
                    }, {
                        resourceId: currId
                    }, {
                        approved: true
                    }]
                }).fetch();
                    if((res.sharing == "limited" && reservationCount.length < res.limit) || (res.sharing == "unlimited") || (res.sharing == "exclusive" && reservationCount.length ==0)){
                        // then this reservation is ok, so far
                    }
                    else{
                        shouldCancel = true;
                        break;
                    }
                }
                if(!shouldCancel){
                    toCancel.splice(j, 1);
                }
            }
            
            for (var j = 0; j < toCancel.length; j++) {
                // TODO if resource is limited and under the limit or if resource is unlimited, don't cancel
                
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