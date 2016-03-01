
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

function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getToken() {
    var token = getParameterByName('access_token');
    if (!token) {
        window.location = "https://oauth.oit.duke.edu/oauth/authorize.php"
        + "?client_id=" + myApp.clientId
        + "&state=" + Math.random()
        + "&response_type=token"
        + "&redirect_uri=" + myApp.redirectURIs[0];//change this to redirect other places!
    }
    return token;
}




//server
/*
var https = require('https');
//just omit the callback if you want to use it as a promise
function getNetid(token, callback) {
    return new Promise((resolve, reject) => {
        var data = '';
        https.get('https://oauth.oit.duke.edu/oauth/resource.php?access_token=' + token, (res) => {
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
            res.on('error',(err) => {reject(err);});
        }
    }).then(callback);
}
*/


Template.oauth.onRendered(function(){
  var result = getToken();
  //Meteor.call()
  console.log(result);
});

