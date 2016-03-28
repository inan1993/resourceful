Template.editgroup.helpers({
    onSuccess: function () {
        return function (result) {
            Router.go('groupslist')
            toastr.success("Removed Group!");
        };
    },
    optionsHelper: function () {
        console.log(" hello ")
        console.log(this);
       
        return Meteor.users.find({}).map(function (u){
            return {label: u.emails[0].address, value: u._id};
        })
    }
});