Template.enrollaccount.events({
    'submit #enroll-form': function (event) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var passVar = event.target.password.value;
        Accounts.resetPassword(Session.get('_resetPasswordToken'), password, function (err) {
            if(err){
                toastr.error(err.reason);
            }
            else{
                toastr.success("Password set!")
                Router.go("dashboard");
            }
        
      })
    }
});
