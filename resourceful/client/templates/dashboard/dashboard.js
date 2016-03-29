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

Template.dashboard.helpers({
    getResources: function () {
        return TagsSearch.getData({
            sort: {
                isoScore: 1
            }
        });
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
    }, 200),
    'click #users': function (event) {
        event.preventDefault();
        Router.go('users');
    },
    'click #reserve': function (event) {
        event.preventDefault();
        Router.go('reservation');
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
