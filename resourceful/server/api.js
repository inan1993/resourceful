
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
      console.log(this.user.email + ' (' + this.userId + ') logged in');
    },
    onLoggedOut: function () {
      console.log(this.user.email + ' (' + this.userId + ') logged out');
    }
  });

  // Generates: GET, POST on /api/collection and GET, PUT, DELETE on /api/collection/:id for the collections
  //Api.addCollection(Reservations);
  

Api.addRoute('reservations', {authRequired: true}, {
  get: {

      action: function () {
      console.log(this.userId )
      // GET api/articles

      //if (!Roles.userIsInRole(this.userId, 'admin')){
resourcesICanView = Resources.find({canView: {$in: [ this.userId ]} }).fetch();
console.log(resourcesICanView)
data = Reservations.find({resourceId: {$in: [ resourcesICanView ]}}).fetch(); // any reservation has a resourceid that we are in the canView of
console.log("Data is " + data)
        return {
         status: "do not have permission!",
         data: Reservations.find({resourceId: {$in: [ resourcesICanView ]}}).fetch()
        }

    }
  },
  post: function () {
    // POST api/articles
      return {
         status: "do not have permissions!",
         data: {}
        }
  },
  put: function () {
    // PUT api/articles
  },
  patch: function () {
    // PATCH api/articles
  },
  delete: function () {
    // DELETE api/articles
  },
  options: function () {
    // OPTIONS api/articles
  }
});

Api.addRoute('resources', {authRequired: true}, {
  get: {

      action: function () {
      console.log(this.userId )
      // GET api/articles

      //if (!Roles.userIsInRole(this.userId, 'admin')){
resourcesICanView = Resources.find({canView: {$in: [ this.userId ]} }).fetch();
console.log(resourcesICanView)
       return {
         status: "resources you can view",
         data: resourcesICanView
        }

    }
  },
  post: function () {
    // POST api/articles
    console.log(this.bodyParams)


      return {
         status: "do not have permissions!",
         data: {}
        }
  },
  put: function () {
    // PUT api/articles
  },
  patch: function () {
    // PATCH api/articles
  },
  delete: function () {
    // DELETE api/articles
  },
  options: function () {
    // OPTIONS api/articles
  }
});



/*

  Api.addCollection(Reservations, {
    routeOptions: {
      authRequired: true
    },
      endpoints: {
      
      get: {
     
      authRequired: true,
      action: function () {
      console.log(this.userId )
      // GET api/articles

      if (!Roles.userIsInRole(this.userId, 'admin')){

        return {
          status: "do not have permission!",
         // data: Reservations.find
        }

      }


      return {
        status: "successful"

      }

    }
  },
      post: {
       roleRequired: 'admin'
      },
     delete: {
        roleRequired: 'admin'
      }
    }
  });

*/

  // Api.addCollection(Resources);

  // Generates: POST on /api/users and GET, DELETE /api/users/:id fulfor
  // Meteor.users collection
  Api.addCollection(Meteor.users, {
    routeOptions: {
      authRequired: true
    },
    endpoints: {
    
      post: {
       roleRequired: 'admin'
      },
     delete: {
        roleRequired: 'admin'
      }
    }
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
/*
isResourceManager: function (){
        if(Roles.userIsInRole(Meteor.user(), ['admin', 'resourceManager']) || Groups.findOne({$and: [{
                members: {
                    $in: [Meteor.user()._id]
                }
                    }, {
                resourceManagers: true
                    }]})){
            return true;
        }
        else{
            return false;
        }
    }
*/
