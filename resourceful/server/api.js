
if (Meteor.isServer) {

  // Global API configuration
  var Api = new Restivus({
    apiPath: 'api/',
    useDefaultAuth: true,
    prettyJson: true,
    // auth: {
    //   token: 'auth.apiKey',
    //   user: function () {
    //     return {
    //       userId: this.request.headers['user-id'],
    //       token: this.request.headers['login-token']
    //     };
    //   }
    // },
    onLoggedIn: function () {
      console.log(this.user.username + ' (' + this.userId + ') logged in');
    },
    onLoggedOut: function () {
      console.log(this.user.username + ' (' + this.userId + ') logged out');
    }
  });

  // Generates: GET, POST on /api/collection and GET, PUT, DELETE on /api/collection/:id for the collections
  Api.addCollection(Reservations);
  // Api.addCollection(Resources);

  // Generates: POST on /api/users and GET, DELETE /api/users/:id for
  // Meteor.users collection
  Api.addCollection(Meteor.users, {
    routeOptions: {
      authRequired: true
    },
    // endpoints: {
    //   post: {
    //     roleRequired: 'admin'
    //   },
    //   delete: {
    //     roleRequired: 'admin'
    //   }
    // }
  });

  // Api.addCollection(Resources, {
  //   // getAll: function () {
  //   //   var userId = this.userId;
  //   //   return Resources.find({ ownerID: userId}).pretty();
  //   // }
  //   routeOptions: {
  //     authRequired: true
  //   }
  // });
}



