Meteor.startup(function(){
	SyncedCron.add({
			name: "expiredIncompleteReservations",
			schedule: function(parser) {
				return parser.text("every 1 minute");
			},
			job: function() {
				var result = deleteExpiredIncompletes();
		        return result;
			}
	});
});


function deleteExpiredIncompletes(){
	var expiredIncompletes = Reservations.find({
		$and :[
			{start : {"$lte" : new Date()}},
			{approved : false},
			{userId : Meteor.userId}
		]}).fetch();

	expiredIncompletes.forEach(function(item){
		sendExpiryEmail(item);
		Reservations.remove(item);
	})
	return true;

}

function sendExpiryEmail(item){
	 var expiryDetails = {
                    from: "team@resourceful.com",
                    to: item.email,
                    subject: "Reservation Removed Due to expired non-approval!",
                    text: "Hello, your reservation was deleted because it was not approved before its scheduled start time!",
                    date: item.start
                }

    Meteor.call('scheduleMail', expiryDetails, function (error, result) {});
}