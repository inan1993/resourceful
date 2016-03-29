var reserveHooks = {
    before: {
        insert: function (doc) {
        console.log(doc);
        for (i = 0; i < doc.resourceId.length; i++) { 
            currResource = doc.resourceId[i];
            console.log("resource" + i + " " +currResource);
            reserve = Reservations.findOne({
                    $and: [{
                        start: {
                            $lte: doc.end
                        }
                    }, {
                        end: {
                            $gte: doc.start
                        }
                    }, {
                        resourceId: currResource
                    },{
                        approved: true
                    }]
                });
            // this means theres an overlap with an already granted reservation - reject this one
            if(reserve) {
                console.log(reserve)
                toastr.error('One or more resources already reserved!');
                return false;
            }
            myRes = Resources.findOne({_id: currResource});
            if(!myRes.restricted){
            wildWest = Reservations.findOne({
                    $and: [{
                        start: {
                            $lte: doc.end
                        }
                    }, {
                        end: {
                            $gte: doc.start
                        }
                    }, {
                        resourceId: currResource
                    },{
                        approved: false
                    }]
                });
            if(wildWest){
                console.log("WILDWEST " + myRes)
                toastr.error('An unrestricted resource is blocked for this period. Cannot reserve');
                return false;
            }
            }
        }
            if (Meteor.userId()) {
                doc.userId = Meteor.userId();
                doc.email = Meteor.user().emails[0].address;  
            }
            console.log(doc);
            return doc;
        }

    },
    after: {
        insert: function (error, result) {
            if (error) {
                toastr.error(error);
                console.log(error);
            } else {
                var added = Reservations.findOne({
                    _id: result
                });
                toastr.success('Reserved!');
                // update reservation's "approved" status
                // The wild west argument is only about approval.
                // if you're the last needed approval, change reservation status to approved and cancel all competing reservations
                Meteor.call("checkApprovals", result);
                var startDetails = {
                    from: "team@resourceful.com",
                    to: added.email,
                    subject: "Reservation Starting!",
                    text: "Hello, your reservation is starting now!",
                    date: added.start
                }
                var endDetails = {
                        from: "team@resourceful.com",
                        to: added.email,
                        subject: "Reservation Starting!",
                        text: "Hello, your reservation is ending now!",
                        date: added.end
                }
                // async callback to add key to database
                Meteor.call('scheduleMail', startDetails, function (error, result) {
                    if (!error) {
                        Reservations.update(added, {
                            startId: result
                        });
                    }
                });
                Meteor.call('scheduleMail', endDetails, function (error, result) {
                    if (!error) {
                        Reservations.update(added, {
                            endId: result
                        });
                    }
                });

            }
        }
    }
}

AutoForm.addHooks('insertReservationForm', reserveHooks);


Template.reservation.helpers({
    optionsHelper: function () {
        if(Roles.userIsInRole(Meteor.user(), ['resourceManager'])){
            return Resources.find({}).map(function (u){
                return {label: u.name, value: u._id};
        });
        }
        return Resources.find({canReserve: {$in: [Meteor.user()._id]}}).map(function (u){
            return {label: u.name, value: u._id};
        });
    }
});