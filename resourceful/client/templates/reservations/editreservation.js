var reservationHooks = {
    before: {
        update: function (doc) {
            current = Reservations.findOne({_id: Router.current().params._id});
            if((current.end<doc.end || current.start>doc.start) && current.approved){
                toastr.error("You can only reduce the span of an approved reservation. Please create a new reservation.");
                
                Router.go("reservation");
                return false;
            }
            // Two cases, one, you have a resource which is unrestricted and reserved, which means you always reject
            // else, you have a resource which is restricted and approved
            if (Reservations.findOne({
                    $and: [{
                        start: {
                            $lte: doc.end
                        }
                    }, {
                        end: {
                            $gte: doc.start
                        }
                    }, {
                        resourceId: Router.current().params._id
                    },{
                        approved: true
                    }]
                })) {
                toastr.error('Already reserved!');
                return false;
            }
            if(_.contains(Resources.findOne(Router.current().params._id))){
                if (!(_.contains(Resources.findOne(Router.current().params._id).canReserve, Meteor.user()._id))) {
                    toastr.error('You cant reserve this!');
                    return false;
                }
             }
            return doc;
        }
    },
    after: {
        update: function (error, result) {
            if (error) {
                toastr.error(error);
                console.log(error);
            } else {
                console.log("Updated!");
                var added = Reservations.findOne(Router.current().params._id);
                Meteor.call('cancelMail', added.startEmailId);
                Meteor.call('cancelMail', added.endEmailId);
                var startDetails = {
                    from: "team@resourceful.com",
                    to: added.email,
                    subject: "Reservation Starting!",
                    text: "Hello, your updated reservation is starting now!",
                    date: added.start
                }
                var endDetails = {
                        from: "team@resourceful.com",
                        to: added.email,
                        subject: "Reservation Starting!",
                        text: "Hello, your updated upreservation is ending now!",
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
                console.log(Reservations.findOne(Router.current().params._id));
                toastr.success('Updated reservation!')
                Router.go('/');
            }
        }
    }
}

AutoForm.addHooks('updateReservationForm', reservationHooks);

Template.editreservation.helpers({
    onSuccess: function () {
        return function (result) {
            toastr.success("Deleted!");
        };
    },
    beforeRemove: function () {
        return function (collection, id) {
            Router.go('resource', {
                _id: Reservations.findOne(Router.current().params._id).resourceId
            });
            this.remove();
        };
    },
    optionsHelper: function () {
        return Resources.find({}).map(function (u){
            return {label: u.name, value: u._id};
        });
    }
});