Template.editgroup.helpers({
    onSuccess: function () {
        return function (result) {
            Router.go('groupslist')
            toastr.success("Removed Group!");
        };
    }
});