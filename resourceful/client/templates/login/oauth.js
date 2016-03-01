


Meteor.loginAsDuke = function(netid, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {duke: true, netID: netid};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};



/*
var myApp = {
  "clientSecret": "Xcp6BJ%CVxnkaG3cogGWIWA@DJxY@cm*uv*TRWofQHo$ovDnJ+",
  "displayName": "Resourceful",
  "description": "A resource reservation-system for ECE 458",
  "ownerDescription": "Pratt Undergraduate Student, Class of 2016",
  "privacyURL": "resourceful.meteor.com/privacy",
    "appOwners": [
        "ssm33@duke.edu"
    ],
    "redirectURIs": [
        "https://localhost:3000/oauth"
        //"https://resourceful2.meteor.com/oauth"
      
    ],
    "permissions": [
        {
            "service": "basic",
            "access": "full"
        }
    ]
};
*/
