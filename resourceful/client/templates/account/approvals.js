Template.approvals.helpers({
    getResources: function () {
        currUser = Meteor.user()._id;
        // find all resources I manage
        return Resources.find({
            $and: [{
                managers: {
                    $in: [currUser]
                }
                    }, {
                restricted: true
                    }]
        })
    },
    getReservations: function(){
            return Reservations.find({
                    $and: [{
                        resourceId: this._id
                    }, {
                        approved: false
                    }]
                })
    }
});

Template.approvals.events({
    'click #approve': function (event) {
        event.preventDefault();
        console.log(this);
        // check if this is the last needed approval. if not, just add this resource to the approval list.
        
        // If we are the last approval, check if there are reservations that will be cancelled if we approve this one
        // for all resources in this reservation
        // find out if theres another unapproved reservation in this time period
        
        resources = Resources.find({
            $and: [{
                _id: {
                    $in: [this.resourceId]
                }
                    }, {
                restricted: true
                    }]
        }).fetch();
        console.log(resources)
        // now check the timestamp of any reservation on any of these resources to see if it conflicts
        console.log(Reservations.find({
            $and: [{
                    resourceId: {
                        $in: [resources] }}, { approved: false }]

        }).fetch())
        cancelled = Reservations.find({
            $and: [{
                    resourceId: {
                        $in: [resources] }}, { approved: false },
                {
                    $and: [{
                            start: {
                                $lte: this.end
                            }
                    }, {
                            end: {
                                $gte: this.start
                            }
                    }
                  ]}]

        }).fetch();
        console.log("WILL CANCEL")
        console.log(cancelled);
        if(cancelled.length!=0){
        if (confirm('The following reservations will be rejected upon approval: ')) {
            //TODO: remove the old reservations


        } else {
            return false;
        }
        }
        // set this one to approved
        //Reservations.update({_id: this._id}, {$set: {approved:true}});
        // Cancel all the other reservations
        
    },
    'click #reject': function (event) {
        event.preventDefault();
        console.log(this);
        Meteor.call("rejectReservation", this._id);
    }
});