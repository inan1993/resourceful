
// var myApp = {
//   "clientSecret": "Xcp6BJ%CVxnkaG3cogGWIWA@DJxY@cm*uv*TRWofQHo$ovDnJ+",
//   "displayName": "Resourceful",
//   "description": "A resource reservation-system for ECE 458",
//   "ownerDescription": "Pratt Undergraduate Student, Class of 2016",
//   "privacyURL": "resourceful.meteor.com/privacy",
//     "appOwners": [
//         "ssm33@duke.edu"
//     ],
//     "redirectURIs": [
//         "http://localhost:3000/oauth"
//         // "ec2-52-90-134-50.compute-1.amazonaws.com/oauth"
//     ],
//     "permissions": [
//         {
//             "service": "basic",
//             "access": "full"
//         }
//     ]
// };




Meteor.methods({

    getNetid: function (token) {

 /*
        HTTP.call( 'GET', 'https://oauth.oit.duke.edu/oauth/resource.php?access_token=' + token, {}, function( error, response ) {
            if ( error ) {
            console.log( error );
            result = error;
            } else {
            console.log( response );
            result = response;

            datastring = JSON.stringify(result.data);

            netid = datastring.substring(9, datastring.indexOf("duke.edu")+8);
            console.log("this is the authenticated netid: " + netid);
              //logs on server terminal, not client obviously
              //having trouble with getting this data back to the client
              //cant log in from server side
            result = netid;



              var user = Meteor.users.findOne({username: netid});
             if(!user) {
             userId = Meteor.users.insert({username: netid});
                }

            
         }
        });
        */

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
          


/*
try{
       //var user =  Accounts.findUserByEmail(netid); 
      //if(user){
      // Accounts.setPassword(netid, token);
      //}else{
       //  Accounts.createUser({email: netid});
        //  Accounts.setPassword(netid, token);
      //}

      if (!Meteor.users.findOne({email: netid})){
        console.log("user not found");
         Accounts.createUser({email: netid});
      }
      Accounts.setPassword(netid, token);

}catch(e){

console.log("Error with setting pw");
//Accounts.createUser({email: netid});
//Accounts.setPassword(netid, token);
}
     */ 
        

       // console.log(netid);
        return netid;
}



    });





Accounts.registerLoginHandler(function(loginRequest) {
  //there are multiple login handlers in meteor. 
  //a login request go through all these handlers to find it's login hander
  //so in our login handler, we only consider login requests which has admin field
  if(!loginRequest.duke) {
    return undefined;
  }


/*
  //our authentication logic :)
  if(loginRequest.password != 'admin-password') {
    return null;
  }
  */
  
  //we create a admin user if not exists, and get the userId
  var userId = null;
  var user = Meteor.users.findOne({username: loginRequest.netID});
  if(!user) {
    userId = Meteor.users.insert({username: loginRequest.netID});
  } else {
    userId = user._id;
  }

  //send loggedin user's user id
  return {
    id: userId
  }
});

/*
Meteor.loginAsDuke = function(netid, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
  var loginRequest = {duke: true, netID: netid};

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};


*/