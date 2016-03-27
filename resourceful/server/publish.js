Meteor.publish('reservations', function (start, end, id) {
    return Reservations.find({resourceId: id });
});
Meteor.publish("allUsers", function () {
  return Meteor.users.find({});
});