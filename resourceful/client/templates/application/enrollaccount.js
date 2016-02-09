Template.enrollaccount.events({
    'submit #enroll-form': function (event) {
        event.preventDefault();
        // Auto-encrypts password, logs user in if successful
        var passVar = event.target.password.value;
        var tokenVar = Session.get('_resetPasswordToken');
        Accounts.resetPassword(tokenVar, passVar, function (err) {
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
