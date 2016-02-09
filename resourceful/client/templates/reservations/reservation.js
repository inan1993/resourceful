var reservationHooks = {
    before: {
        update: function (doc) {
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
                    }]
                })) {
                toastr.error('Already reserved!');
                return false;
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
                var added = Reservations.findOne({
                    _id: result
                });
                Meteor.call('cancelMail', added.startEmailId);
                Meteor.call('cancelMail', added.endEmailId);
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
                console.log(Reservations.findOne(Router.current().params._id));
                toastr.success('Updated reservation!')
                Router.go('resource', {
                    _id: Reservations.findOne(Router.current().params._id).resourceId
                });
            }
        }
    }
}

AutoForm.addHooks('updateReservationForm', reservationHooks);

Template.reservation.helpers({
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
    }
});