if (Meteor.isClient) {
    toastr.options = {
        "positionClass": "toast-bottom-right",
    }
    // Register callback to handle enrollment verification, not used yet
    Accounts.onEnrollmentLink({
        
    })
}