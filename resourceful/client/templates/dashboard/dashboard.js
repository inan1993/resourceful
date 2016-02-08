Template.dashboard.helpers({
    resources: function () {
        if(Meteor.user()){
 		    return Resources.find();
        }
	}
});

Template.dashboard.events({
    'click .list-group-item': function (event) {
        event.preventDefault();
        Router.go('resource', {_id: this._id});
	}
});
