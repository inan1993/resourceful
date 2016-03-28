var resourceHooks = {
    after: {
    insert: function(error, result) {
        if(error){
            toastr.error(error);
            console.log(error);
        }
        else{
            console.log(result);
            toastr.success('added resource '+ Resources.findOne(result).name);
        }
    }
  }
}

AutoForm.addHooks('insertResourceForm', resourceHooks);

Template.addresource.helpers({
    optionsHelper: function () {
        return Meteor.users.find({}).map(function (u){
            return {label: u.emails[0].address, value: u._id};
        })
    }
});