var resourceHooks = {
    after: {
        update: function (error, result) {
            if (error) {
                toastr.error(error);
                console.log(error);
            } else {
                toastr.success('Updated resource!')
                Router.render('dashboard');
                Router.go('dashboard');
            }
        }
    }
}

AutoForm.addHooks('updateResourceForm', resourceHooks);

Template.editresource.helpers({
    onSuccess: function () {
        return function (result) {
            toastr.success("Removed Resource!");
        };
    },
    beforeRemove: function () {
        return function (collection, id) {
            if(Reservations.findOne({resourceId: Router.current().params._id})){
                if (confirm('The resource has a reservation. Delete anyway?')) {
                    //TODO: remove the old reservations
                    Router.go('dashboard');
                    this.remove();
                } 
                else{
                    return false;
                }
            }
            else{
                Router.go('dashboard');
                this.remove();
            }
        };
    },
    optionsHelper: function () {
        return Meteor.users.find({}).map(function (u){
            return {label: u.emails[0].address, value: u._id};
        })
    }
});