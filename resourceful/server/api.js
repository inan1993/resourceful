
if (Meteor.isServer) {

  // Global API configuration
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  // Generates: GET, POST on /api/items and GET, PUT, DELETE on
  // /api/items/:id for the Items collection
  Api.addCollection(Reservations);
  Api.addCollection(Resources);
  Api.addCollection(Meteor.users);

  // Generates: POST on /api/users and GET, DELETE /api/users/:id for
  // Meteor.users collection
// Api.addCollection(Meteor.users, {
//   //excludedEndpoints: ['getAll', 'put'],
//   routeOptions: {
//     authRequired: true
//   },
//   endpoints: {
//     post: {
//       roleRequired: 'admin'
//     },
//     delete: {
//       roleRequired: 'admin'
//     }
//   }
// });
}