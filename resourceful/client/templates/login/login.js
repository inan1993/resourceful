Template.login.events({


    'submit #login-form': function (event) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var emailVar = event.target.email.value;
        var passVar = event.target.password.value;
        Meteor.loginWithPassword(emailVar, passVar, function (err) {
            if (Meteor.user()) {
                Router.go('/');
            } else {
                console.log(err.reason);
                toastr.error(err.reason);
            }
        });
    },

    'submit #duke-login': function (event) {
        event.preventDefault();
        //window.location = "https://www.google.com";
        //window.location = "https://oauth.oit.duke.edu/oauth/authorize.php?client_id=ECE458_Resource_manager7&state=0.6590120431501418&response_type=token&redirect_uri=https://resourceful2.meteor.com/oauth";
        
         window.location = "https://oauth.oit.duke.edu/oauth/authorize.php"
        + "?client_id=" + "resourceful"
        + "&state=" + Math.random()
        + "&response_type=token"
        + "&redirect_uri=" + 
                            // "http://localhost:3000/oauth"; 
                            "https://resourceful-60861.onmodulus.net/oauth";
     
    },

    'click #logout-button': function (event) {
        console.log("logging out");
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});
