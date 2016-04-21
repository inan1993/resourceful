var reservationHooks = {
    before: {
        update: function (doc) {
            current = Reservations.findOne({_id: Router.current().params._id});
            if( (current.end<doc.$set.end || current.start<doc.$set.start) && current.approved ){
                if(confirm("You can only reduce the span of an approved reservation. Make a new reservation?")){
                    console.log("going, sending " + Router.current().params._id)
                   Router.go('reservation', {
                        _id: Router.current().params._id
                    });
                   return false;
                }
            else{
                return false;
            }

            }
            if (Reservations.findOne({
                    $and: [{
                        start: {
                            $lte: doc.$set.end
                        }
                    }, {
                        end: {
                            $gte: doc.$set.start
                        }
                    }, {
                        resourceId: Router.current().params._id
                    },{
                        approved: true
                    }]
                })) {
                toastr.error('Already reserved!');
                return false;
            }
            if(_.contains(Resources.findOne(Router.current().params._id))){
                if (!(_.contains(Resources.findOne(Router.current().params._id).canReserve, Meteor.user()._id))) {
                    toastr.error('You cant reserve this!');
                    return false;
                }
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
                var added = Reservations.findOne(Router.current().params._id);
                Meteor.call('cancelMail', added.startEmailId);
                Meteor.call('cancelMail', added.endEmailId);
                var startDetails = {
                    from: "team@resourceful.com",
                    to: added.email,
                    subject: "Reservation Starting!",
                    text: "Hello, your updated reservation is starting now!",
                    date: added.start
                }
                var endDetails = {
                        from: "team@resourceful.com",
                        to: added.email,
                        subject: "Reservation Starting!",
                        text: "Hello, your updated upreservation is ending now!",
                        date: added.end
                }
                // async callback to add key to database
                Meteor.call('scheduleMail', startDetails, function (error, result) {
                    if (!error) {
                        Reservations.update(added, {
                            startId: result
                        });
                    }
                });
                Meteor.call('scheduleMail', endDetails, function (error, result) {
                    if (!error) {
                        Reservations.update(added, {
                            endId: result
                        });
                    }
                });
                console.log(Reservations.findOne(Router.current().params._id));
                toastr.success('Updated reservation!')
                Router.go('/');
            }
        }
    }
}
Template.editreservation.onRendered(function () {
    // get top level resources you can view

    var topLevel = Resources.find({
        $and: [{
                canView: {
                    $in: [Meteor.userId()]
                }
            }, {
                canReserve: {
                    $in: [Meteor.userId()]
                }
               },
            {
                parentId: {
                    $exists: false
                }
            }
                              ]
    }).fetch();
    
    console.log(topLevel);
    var data = [];
    for (i = 0; i < topLevel.length; i++) {
        data.push(treeGenerator(topLevel[i]));
    }
    resources = Reservations.findOne(Router.current().params._id).resourceId;
    
    var $tree = $('#resTree');
    this.$('#resTree').tree({
        data: data,
        autoOpen: true
    });
    for(var z = 0; z<resources.length; z++){
        var node = $tree.tree('getNodeById', resources[z]);
        $tree.tree('addToSelection', node);
    }
    this.$('#resTree').bind(
        'tree.click',
        function (e) {
            // Disable single selection
            e.preventDefault();
        }
    );
});

function treeGenerator(node) {
    var data = {
        label: node.name,
        id: node._id,
        children: []
    };
    console.log("data below");
    console.log(data);
    myChildren = Resources.find({
        $and: [
            {
                canView: {
                    $in: [Meteor.userId()]
                }
            },
            {
                parentId: node._id
        }, {
                canReserve: {
                    $in: [Meteor.userId()]
                }
        }
    ]
    }).fetch();
    
    for (var k = 0; k < myChildren.length; k++) {
        data.children.push(treeGenerator(myChildren[k]));
    }
    return data;
}
AutoForm.addHooks('updateReservationForm', reservationHooks);

Template.editreservation.helpers({
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
    },
    optionsHelper: function () {
        return Resources.find({}).map(function (u){
            return {label: u.name, value: u._id};
        });
    }
});