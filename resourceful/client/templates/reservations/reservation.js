var reserveHooks = {
    before: {
        insert: function (doc) {
        console.log(doc);
        if(typeof doc.resourceId == "undefined"){
            toastr.error('no resource selected');
            return false;
        }
        doc.approved = true;
        for (i = 0; i < doc.resourceId.length; i++) { 
            currResource = doc.resourceId[i];
            console.log("resource" + i + " " +currResource);
            if(Resources.findOne({_id:currResource}).restricted){
                doc.approved = false;
            }
            reserve = Reservations.findOne({
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
                    }]
                });

                if(reserve) {
                // Now we have every reservation that overlaps on the current resource.
                // a fatal error occurs if this is an unrestricted resource and any other resource in the reservation is                        restricted, or if this is a restricted resource that has been approved
                console.log(reserve)
                
                toastr.error('One or more resources already reserved or pending!');
                return false;
            }
            
        }
            if (Meteor.userId()) {
                doc.userId = Meteor.userId();
                doc.email = Meteor.user().emails[0].address;  
            }
            return doc;
        }

    },
    after: {
        insert: function (error, result) {
            console.log(error);
            console.log(result);
            if (error) {               
                toastr.error(error);
            } else {
                console.log("I was called!")
                var added = Reservations.findOne({
                    _id: result
                });
                toastr.success('Reserved!');
                var startDetails = {
                    from: "team@resourceful.com",
                    to: added.email,
                    subject: "Reservation Starting!",
                    text: "Hello, your reservation is starting now!",
                    date: added.start
                }
                var endDetails = {
                        from: "team@resourceful.com",
                        to: added.email,
                        subject: "Reservation Starting!",
                        text: "Hello, your reservation is ending now!",
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

AutoForm.addHooks('insertReservationForm', reserveHooks);


Template.reservation.helpers({
    optionsHelper: function () {
        return Resources.find({}).map(function (u){
            return {label: u.name, value: u._id};
        });
    }
});