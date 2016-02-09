Meteor.publish('reservations', function (start, end, id) {
    return Reservations.find({resourceId: id });
});