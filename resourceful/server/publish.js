Meteor.publish('reservations', function (start, end, id) {
    return Reservations.find({resourceId: id });
});
Meteor.publish("allUsers", function () {
  return Meteor.users.find({});
});
// Meteor.users.allow({
//   update: function (userId, user, fields, modifier) {
//     // can only change your own documents
//     if(user._id === userId)
//     {
//       Meteor.users.update({_id: userId}, modifier);
//       return true;
//     }
//     else return false;
//   }
// });