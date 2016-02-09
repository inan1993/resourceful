var reserveHooks = {
    before: {
        insert: function (doc) {
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
            if (Meteor.userId()) {
                doc.userId = Meteor.userId();
                doc.email = Meteor.user().emails[0].address
                doc.resourceId = Router.current().params._id;
            }
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



Template.resource.helpers({
    calendarHeader: function () {
        return {
            left: 'prev,next,today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        }
    },
    events: function () {
        var fc = $('.fc');
        return function (start, end, tz, callback) {
            //subscribe only to specified date range
            Meteor.subscribe('reservations', start.toDate(), end.toDate(), Router.current().params._id, function () {
                //trigger event rendering when collection is downloaded
                fc.fullCalendar('refetchEvents');
            });
            console.log(Reservations.find({
                resourceId: Router.current().params._id
            }).fetch());
            var reserves = Reservations.find({
                resourceId: Router.current().params._id
            }).map(function (it) {
                return {
                    title: "Reserved by " + it.email,
                    id: it._id,
                    creator: it.userId,
                    start: it.start,
                    end: it.end
                };
            });
            callback(reserves);
        };
    },
    onEventClicked: function () {
        return function (calEvent, jsEvent, view) {
            // Check if authorized
            if (Roles.userIsInRole(Meteor.user(), ['admin']) || calEvent.userId == Meteor.userId()) {
                Router.go('reservation', {
                    _id: calEvent.id
                });

            }
        }
    }
});

Template.resource.events({
    'click #edit-resource': function (event) {
        event.preventDefault();
        Router.go('editresource', {
            _id: Router.current().params._id
        });
    }
});

Template.resource.rendered = function () {
    var fc = this.$('.fc');
    this.autorun(function () {
        //1) trigger event re-rendering when the collection is changed in any way
        //2) find all, because we've already subscribed to a specific range
        Reservations.find();
        fc.fullCalendar('refetchEvents');
    });
};