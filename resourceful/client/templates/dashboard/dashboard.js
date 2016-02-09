var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['tags'];

var TagsSearch = new SearchSource('tags', fields, options);

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

Template.dashboard.events({
    'click .list-group-item': function (event) {
        event.preventDefault();
        Router.go('resource', {
            _id: this._id
        });
    },
    // So hacky, due to a bad choice of using meteor's search source
    'keyup #search-box': _.throttle(function (e) {
        var text = $(e.target).val().trim();
            TagsSearch.search(text);
    }, 200)
});
