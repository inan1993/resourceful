var resourceHooks = {
//    before:{
//        update: function(doc){
//            console.log("Update attempted")
////            resource = Resources.findOne({_id: doc.$set._id});
////            if(!doc.$set.restricted && resource.restricted){
////                out = Reservations.find({resourceId: {$in: [resource._id]}}).fetch()
////                for(i=0; i<out.length; i++){
////                    Meteor.call("checkApprovals", out[i]);
////                }
////            }
//        }
//    },
    after: {
        update: function (error, result) {
            console.log("Update completed")
            if (error) {
                toastr.error(error);
                console.log(error);
            } else {
                toastr.success('Updated resource!')
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
            Router.go('dashboard');
        };
    },
    beforeRemove: function () {
        return function (collection, id) {
            if(Reservations.findOne({resourceId: {$in: [Router.current().params._id]}})){
                if (confirm('The resource has a reservation. Delete anyway?')) {
                    //TODO: remove the old reservations
                    Reservations.remove({resourceId: {$in: [Router.current().params._id]}});
                    this.remove();
                    Router.go('dashboard');
                } 
                else{
                    return false;
                }
            }
            else{
                this.remove();
            }
        };
    },
    canReserve: function () {
        if (_.contains(Resources.findOne(Router.current().params._id).canReserve, Meteor.user()._id)) {
            return true;
        }
        else{
            return false;
        }          
    },
    optionsHelper: function () {
        return Meteor.users.find({}).map(function (u){
            return {label: u.emails[0].address, value: u._id};
        })
    }
});