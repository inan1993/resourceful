var reserveHooks = {
    before: {
        insert: function (doc) {
            console.log
            immediateApprove = true;
            doc.resourceId = [];
            
            var nodes = $('#resTree').tree('getSelectedNodes');
            if (!nodes) {
                toastr.error("Please select a resource")
                return false;
            }
            for(i = 0; i<nodes.length; i++){
                console.log(nodes[i].id);
                doc.resourceId.push(nodes[i].id);
            }
            
            for (i = 0; i < doc.resourceId.length; i++) {


                currResource = doc.resourceId[i];
                myRes = Resources.findOne({
                    _id: currResource
                });
                // check if you can reserve the resource here
                if (!(_.contains(myRes.canReserve, Meteor.userId()))) {
                    toaster.error("You don't have permission to reserve this!");
                    return false;
                }
                // Check if I have requisite permission
                console.log("resource" + i + " " + currResource);

                reserve = Reservations.find({
                    $and: [{
                        start: {
                            $lte: doc.end
                        }
                    }, {
                        end: {
                            $gte: doc.start
                        }
                    }, {
                        resourceId: currResource
                    }, {
                        approved: true
                    }]
                }).fetch();
                reserve = _.uniq(reserve);
                if (myRes.sharing == "limited") {
                    console.log("limited");
                    if (reserve.length >= myRes.limit) {
                        toastr.error("Resource " + myRes.name + " limited to " + myRes.limit + " reservations!");
                        return false;
                    }
                }
                if (myRes.sharing == "exclusive") {
                    console.log("exclusive");
                    if (reserve.length >= 1) {
                        toastr.error("Resource " + myRes.name + " limited to 1 reservation!");
                        return false;
                    }
                }

                if (!myRes.restricted) {
                    wildWest = Reservations.findOne({
                        $and: [{
                            start: {
                                $lte: doc.end
                            }
                    }, {
                            end: {
                                $gte: doc.start
                            }
                    }, {
                            resourceId: currResource
                    }, {
                            approved: false
                    }]
                    });
                    if (wildWest) {
                        console.log("WILDWEST " + myRes)
                        toastr.error('An unrestricted resource is blocked for this period. Cannot reserve');
                        return false;
                    }
                } else {
                    immediateApprove = false;
                }
            }
            if (Meteor.userId()) {
                doc.userId = Meteor.userId();
                doc.email = Meteor.user().emails[0].address;
            }
            if (immediateApprove) {
                console.log("immed approve");
                doc.approved = true;
            }
            return doc;
        }

    },
    after: {
        insert: function (error, result) {
            if (error) {
                toastr.error(error);
            } else {
                console.log("I was called!")
                var added = Reservations.findOne({
                    _id: result
                });
                console.log("Below should have elem")
                output = Resources.find({
                    $and: [{
                        _id: {
                            $in: added.resourceId
                        }
                    }, {
                        restricted: true
                    }]
                }).fetch();

                if (output.length != 0) {
                    toastr.warning('Waiting for approval!');
                } else {
                    toastr.success('Reserved!');
                    Router.go('dashboard');
                }

                // update reservation's "approved" status
                // The wild west argument is only about approval.
                // if you're the last needed approval, change reservation status to approved and cancel all competing reservations
                // Meteor.call("checkApprovals", result);


                var startDetails = {
                    from: "team@resourceful.com",
                    to: added.email,
                    subject: "Reservation Starting!",
                    text: "Hello, your reservation, " + added.name + " is starting now!\n Description: " + added.description,
                    date: added.start
                }
                var endDetails = {
                        from: "team@resourceful.com",
                        to: added.email,
                        subject: "Reservation Starting!",
                        text: "Hello, your reservation, " + added.name + " is ending now!",
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

            }
        }
    }
}



Template.reservation.onRendered(function () {
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
    console.log(data);
    console.log("HELLO")
    var $tree = $('#resTree');
    this.$('#resTree').tree({
        data: data,
        autoOpen: true
    });
    this.$('#resTree').bind(
        'tree.click',
        function (e) {
            // Disable single selection
            e.preventDefault();
            var selected_node = e.node;
            if ($tree.tree('isNodeSelected', selected_node)) {
                $tree.tree('removeFromSelection', selected_node);
            } else {
                // DFS to find all child nodes
                $tree.tree('addToSelection', selected_node);
                selectHelper(selected_node, $tree);
                
            }
        }
    );
});
function selectHelper(node, $tree){
    for (j = 0; j < node.children.length; j++) {
        $tree.tree('addToSelection', node.children[j]);
        selectHelper(node.children[j], $tree)
    }
}
function treeGenerator(node) {
    var data = {
        label: node.name,
        id: node._id,
        children: []
    };
    console.log("data below");
    console.log(data);
     console.log("kids")
    var myChildren = Resources.find({
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
    console.log("kids are below");
    console.log(myChildren);
   
    for (var k = 0; k < myChildren.length; k++) {
        data.children.push(treeGenerator(myChildren[k]));
    }
    return data;
}
AutoForm.addHooks('insertReservationForm', reserveHooks);


Template.reservation.helpers({
    //    optionsHelper: function () {
    //        if (Roles.userIsInRole(Meteor.user(), ['reservationManager'] || Groups.findOne({
    //                $and: [{
    //                    members: {
    //                        $in: [Meteor.user()._id]
    //                    }
    //                    }, {
    //                    reservationManagers: true
    //                    }]
    //            }))) {
    //            return Resources.find({}).map(function (u) {
    //                return {
    //                    label: u.name,
    //                    value: u._id
    //                };
    //            });
    //        }
    //        return Resources.find({
    //            canReserve: {
    //                $in: [Meteor.user()._id]
    //            }
    //        }).map(function (u) {
    //            return {
    //                label: u.name,
    //                value: u._id
    //            };
    //        });
    //    },
    today: function () {
        var today = new Date();
        today.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit'
        });
        return today;
    },
    tomorrow: function () {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit'
        });
        return tomorrow;
    }
});