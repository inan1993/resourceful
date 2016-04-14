Template.resource.helpers({
    calendarHeader: function () {
        return {
            left: 'prev,next,today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        }
    },
    events: function () {
        var fc = $('.fc');
        return function (start, end, tz, callback) {
            //subscribe only to specified date range
            Meteor.subscribe('reservations', start.toDate(), end.toDate(), Router.current().params._id, function () {
                //trigger event rendering when collection is downloaded
                fc.fullCalendar('refetchEvents');
            });
            console.log(Reservations.find({
                resourceId: Router.current().params._id
            }).fetch());
            var reserves = Reservations.find({
                resourceId: Router.current().params._id
            }).map(function (it) {
                if(it.approved){
                return {
                    title: it.name + " reserved by " + it.email,
                    id: it._id,
                    creator: it.userId,
                    start: it.start,
                    end: it.end,
                    color: "green"
                };
                } else{
                    return {
                    title: it.name + " reserved by " + it.email,
                    id: it._id,
                    creator: it.userId,
                    start: it.start,
                    end: it.end,
                    color: "red"
                    }
                }
            });
            callback(reserves);
        };
    },
    onEventClicked: function () {
        return function (calEvent, jsEvent, view) {
            // Check if authorized
            if (Roles.userIsInRole(Meteor.user(), ['admin','reservationManager']) || calEvent.userId == Meteor.userId() || Groups.findOne({$and: [{
                members: {
                    $in: [Meteor.user()._id]
                }
                    }, {
                reservationManagers: true
                    }]})) {
                Router.go('editreservation', {
                    _id: calEvent.id
                });

            }
        }
    },
    isResourceManager: function (){
        if(Roles.userIsInRole(Meteor.user(), ['admin', 'resourceManager']) || Groups.findOne({$and: [{
                members: {
                    $in: [Meteor.user()._id]
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
});

Template.resource.events({
    'click #edit-resource': function (event) {
        event.preventDefault();
        Router.go('editresource', {
            _id: Router.current().params._id
        });
    }
});

Template.resource.rendered = function () {
    var fc = this.$('.fc');
    this.autorun(function () {
        //1) trigger event re-rendering when the collection is changed in any way
        //2) find all, because we've already subscribed to a specific range
        Reservations.find();
        fc.fullCalendar('refetchEvents');
    });
};