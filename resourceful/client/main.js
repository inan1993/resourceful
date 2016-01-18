if (Meteor.isClient) {
    Template.login.events({
    });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
