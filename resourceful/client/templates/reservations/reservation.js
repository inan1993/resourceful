var reservationHooks = {
    before: {
        update: function (doc) {
            if (Reservations.findOne({
                    $and: [{
                        start: {
                            $lte: doc.end
                        }
                    }, {
                        end: {
                            $gte: doc.start
                        }
                    }, {
                        resourceId: Router.current().params._id
                    }]
                })) {
                toastr.error('Already reserved!');
                return false;
            }
            return doc;
        }
    },
    after: {
        update: function (error, result) {
            if (error) {
                toastr.error(error);
                console.log(error);
            } else {
                console.log("Updated!");
                console.log(Reservations.findOne(Router.current().params._id));
                toastr.success('Updated reservation!')
                Router.go('resource', {
                    _id: Reservations.findOne(Router.current().params._id).resourceId
                });
            }
        }
    }
}

AutoForm.addHooks('updateReservationForm', reservationHooks);

Template.reservation.helpers({
    onSuccess: function () {
        return function (result) {
            toastr.success("Deleted!");
        };
    },
    beforeRemove: function () {
        return function (collection, id) {
            Router.go('resource', {
                _id: Reservations.findOne(Router.current().params._id).resourceId
            });
            this.remove();
        };
    }
});