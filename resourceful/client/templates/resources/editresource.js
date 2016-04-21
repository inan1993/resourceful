var resourceHooks = {
    before: {
        update: function (doc) {
            cycle = this.docId;
            parent = Resources.findOne({
                _id: doc.$set.parentId
            });
            while (parent) {
                console.log("parent is " + parent.parentId);
                if (parent.parentId == cycle) {
                    toastr.error("No cycles allowed!")
                    return false;
                }
                parent = Resources.findOne({
                    _id: parent.parentId
                });
            }
            return doc;
        }
    },
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
            if (Reservations.findOne({
                    resourceId: {
                        $in: [Router.current().params._id]
                    }
                })) {
                if (confirm('The resource has a reservation. Delete anyway?')) {
                    //TODO: remove the old reservations
                    Reservations.remove({
                        resourceId: {
                            $in: [Router.current().params._id]
                        }
                    });
                    this.remove();
                    Router.go('dashboard');
                } else {
                    return false;
                }
            } else {
                this.remove();
            }
        };
    },
    canReserve: function () {
        if (_.contains(Resources.findOne(Router.current().params._id).canReserve, Meteor.user()._id)) {
            return true;
        } else {
            return false;
        }
    },
    optionsHelper: function () {
        return Meteor.users.find({}).map(function (u) {
            return {
                label: u.emails[0].address,
                value: u._id
            };
        })
    },
    parentHelper: function () {
        return Resources.find({
            $and: [{
                canView: {
                    $in: [Meteor.userId()]
                }
            }, {
                _id: {
                    $ne: Router.current().params._id
                }
            }]
        }).map(function (r) {
            return {
                label: r.name,
                value: r._id
            };
        })
    }
});