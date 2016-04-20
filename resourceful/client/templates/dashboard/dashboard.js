var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: false
};
var fields = ['tags'];

var TagsSearch = new SearchSource('tags', fields, options);

// TODO: make it so homepage doesn't need refreshing post change to collection
Template.dashboard.rendered = function () {
    TagsSearch.search('');
};

function checkResourceManager() {
    if(Roles.userIsInRole(Meteor.user(), ['admin', 'resourceManager']) || Groups.findOne({$and: [{
                members: {
                    $in: [Meteor.userId()]
                }
                    }, {
                resourceManagers: true
                    }]})){
            return true;
        }
        else{
            return false;
        }
}

function checkUserManager() {
    if(Roles.userIsInRole(Meteor.user(), ['admin', 'userManager']) || Groups.findOne({$and: [{
                members: {
                    $in: [Meteor.userId()]
                }
                    }, {
                userManagers: true
                    }]})){
            return true;
        }
        else{
            return false;
        }
}

Session.set("search", false);

Template.dashboard.helpers({
    getResources: function (isSearch) {
        if(isSearch|Session.get("search")){
            // console.log("Parameter: "+isSearch + " Search: "+Session.get("message"));
            return TagsSearch.getData({
                sort: {
                    isoScore: 1
                }
            });
        }else{
            return Resources.find({canView: {$in: [ Meteor.userId() ]}}, options).fetch();
        }
    },
    isManager: function () {
        return checkResourceManager() || checkUserManager();
    },
    isResourceManager: function () {
        return checkResourceManager();
    },
    isUserManager: function () {
        return checkUserManager();
    }
});
// Add a tracker.autorun to automatically rerun search when data source changes
Template.dashboard.events({
    'click .list-group-item': function (event) {
        event.preventDefault();
        Router.go('resource', {
            _id: this._id
        });
    },
    'keyup #search-box': _.throttle(function (e) {
        var text = $(e.target).val().trim();
            TagsSearch.search(text);
        if(text.length>0){
            Session.set("search", true);
        }else{
            Session.set("search", false);
        }
    }, 200),
    'click #users': function (event) {
        event.preventDefault();
        Router.go('users');
    },
    'click #reserve': function (event) {
        event.preventDefault();
        Router.go('reservation');
    },
    'click #approve': function (event) {
        event.preventDefault();
        Router.go('approvals');
    },
    'click #groups': function (event) {
        event.preventDefault();
        Router.go('groupslist');
    },
    'click #resources': function (event) {
        event.preventDefault();
        Router.go('addresource');
    }
});
