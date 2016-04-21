Template.approvals.helpers({
    getResources: function () {
        currUser = Meteor.user()._id;
        // find all resources I manage
        if (Groups.findOne({
                $and: [{
                    members: {
                        $in: [currUser]
                    }
                    }, {
                    reservationManagers: true
                    }]
            })) {
            return Resources.find({
                restricted: true
            })
        }
        return Resources.find({
            $and: [{
                managers: {
                    $in: [currUser]
                }
                    }, {
                restricted: true
                    }]
        })
    },
    getReservations: function () {
        return Reservations.find({
            $and: [{
                resourceId: this._id
                    }, {
                approved: false
                    }, {
                approvals: {
                    $not: {
                        $in: [this._id]
                    }
                }
            }]
        })
    }
});

Template.approvals.events({
    'click .approve': function (event) {
        event.preventDefault();
        // check if this is the last needed approval. if not, just add this resource to the approval list.
        // Get all the needed approvals - this.resourceId contains all of them
        // approve myself
        console.log(event.target.id)
        console.log(this._id);
        thisResource = event.target.id;
        Reservations.update({
            _id: this._id
        }, {
            $addToSet: {
                approvals: thisResource
            }
        });
        reservation = Reservations.findOne({
            _id: this._id
        });

        // If we are the last approval, check if there are reservations that will be cancelled if we approve this one
        // for all resources in this reservation
        // find out if theres another unapproved reservation in this time period
        var willApprove = true;
        for (var i = 0; i < reservation.resourceId.length; i++) {
            // if the resourceId is either unverified or is in our approvals array, we're good
            var currResource = Resources.findOne({
                _id: reservation.resourceId[i]
            });
            if (currResource.restricted) {
                console.log("restricted");
                if (reservation.approvals.length == 0 || !(_.contains(reservation.approvals, reservation.resourceId[i]))) {
                    console.log("not in approvals");
                    willApprove = false;
                }
            }
        }
        approvingResource = Resources.findOne({
            _id: thisResource
        });
        // count reservations on the resource, including us
        numRes = Reservations.find({
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
                    $in: [ thisResource ]
                }
                    }, {
                approvals: { $in: [thisResource] }
                    },
                  {
                        _id: {
                            $ne: reservation._id
                        }
                    }]
        }).fetch().length;
        console.log("I found " + numRes + " reservations");
        cancelOverSubscribed = [];
        if ((numRes == approvingResource.limit && approvingResource.sharing == "limited") || approvingResource.sharing == "exclusive") {
            cancelOverSubscribed = Reservations.find({
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
                            $in: [ thisResource ]
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
            cancelOverSubscribed = _.uniq(cancelOverSubscribed);
            if(cancelOverSubscribed.length !=0){
            console.log("Cancelling BC OVER " + cancelOverSubscribed.length);
            cancelString = "\n"
            for (var j = 0; j < cancelOverSubscribed.length; j++) {
                console.log(cancelOverSubscribed[j]);
                cancelString += cancelOverSubscribed[j].name + "\n"
            }
            if (!confirm('The resource will be full after this reservation! This will cancel following reservations: ' + cancelString)) {
                Reservations.update({
                    _id: this._id
                }, {
                    $pull: {
                        approvals: thisResource
                    }
                });
                return false;
            }
            }
        }


        if (willApprove) {
            Reservations.update({
                _id: reservation._id
            }, {
                $set: {
                    approved: true
                }
            });
            // check what will be removed
            console.log(reservation.resourceId)

            console.log(Reservations.find({
                    resourceId: {
                        $in: reservation.resourceId
                    }
                }).fetch())
                // toCancel contains all unapproved reservations that overlap with us
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
                            $in: [ thisResource ]
                        }
                    },{
                        approved: false
                    }]
            }).fetch();
            toCancel = _.uniq(toCancel);
            console.log("Cancelling " + toCancel.length);
            cancelString = "\n"
                // for each reservation in toCancel, check if it actually doesnt need to be cancelled because all of its resources can accomodate the current number of reservations
                // then, everything else is the same (iterate over the elements and cancel them)

            for (var j = 0; j < toCancel.length; j++) {
                console.log(toCancel[j]);
                cancelString += toCancel[j].name + "\n"
            }

            if (toCancel.length != 0) {
                if (confirm('The following reservations will be rejected upon approval: ' + cancelString)) {
                    //Meteor.call('checkApprovals', this._id);
                    for (var j = 0; j < toCancel.length; j++) {
                        Meteor.call('rejectReservation', toCancel[j]._id);
                    }
                } else {
                    Reservations.update({
                        _id: reservation._id
                    }, {
                        $set: {
                            approved: false
                        }
                    });
                    Reservations.update({
                        _id: this._id
                    }, {
                        $pull: {
                            approvals: thisResource
                        }
                    });
                    return false;
                }
            } else {
                //Meteor.call('checkApprovals', this._id);
            }
        }
        if (cancelOverSubscribed.length != 0) {
            for (var j = 0; j < cancelOverSubscribed.length; j++) {
                Meteor.call('rejectReservation', cancelOverSubscribed[j]._id);
            }
        }
    },
    'click .reject': function (event) {
        event.preventDefault();
        console.log(this);
        Meteor.call("rejectReservation", this._id);
    }
});