Meteor.methods({
  getNetid: function (token) {
      var result = '';

    try{
        result = HTTP.call( 'GET', 'https://oauth.oit.duke.edu/oauth/resource.php?access_token=' + token, {});
      }
    catch(e){
      console.log(e);
      netid = '';
    }
    datastring = JSON.stringify(result.data);
    netid = datastring.substring(9, datastring.indexOf("duke.edu")+8);
    console.log("this is the authenticated netid: " + netid);
    return netid;
  },
  logOutOAuthUser: function(userId){
    console.log("logout!!! - "+Meteor.users.update({_id: userId}, {$set : { "services.resume.loginTokens" : [] }}));
  }
});

Accounts.registerLoginHandler(function(loginRequest) {
  //there are multiple login handlers in meteor. 
  //a login request go through all these handlers to find it's login hander
  //so in our login handler, we only consider login requests which has admin field

  if(!loginRequest.duke) {
    return undefined;
  }
  else{
    console.log('Login Handler Server2 ' + loginRequest.netID);
    var user_Id = null;
    var user = Meteor.users.findOne({emails: [{address: loginRequest.netID, verified: true}]});
    if(!user) {
      user_Id = Meteor.users.insert({emails: [{address: loginRequest.netID, verified: true}]});
    } else {
      user_Id = user._id;
      console.log('User already signed in-'+loginRequest.netID);
    }
    //creating the token and adding to the user
    var stampedToken = Accounts._generateStampedLoginToken();
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);
    Meteor.users.update(user_Id, 
      {$push: {'services.resume.loginTokens': hashStampedToken}}
    );
    //sending token along with the userId
    return {
      userId: user_Id,
      token: stampedToken.token
    }
  }
});