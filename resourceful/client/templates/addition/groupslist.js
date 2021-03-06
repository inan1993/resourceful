
Template.groupslist.helpers({
    getGroups: function () {
        return Groups.find({}).fetch();
    },
    optionsHelper: function () {
        return Meteor.users.find({}).map(function (u){
            return {label: u.emails[0].address, value: u._id};
        })
    },
    getEmail: function(id){
        return Meteor.users.findOne({_id: id}).emails[0].address;
    }
});

Template.groupslist.events({
    'click .list-group-item': function (event) {
        event.preventDefault();
        console.log(this._id);
        Router.go('editgroup', {
            _id: this._id
        });
    }
});
