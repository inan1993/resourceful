


Meteor.loginAsDuke = function(netid, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {duke: true, netID: netid};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};
