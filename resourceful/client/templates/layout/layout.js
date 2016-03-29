Template.layout.events({
    'click .a': function (event) {
        event.preventDefault();
        Router.go("/");
    }
})