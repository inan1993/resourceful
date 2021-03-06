// Backend for chron scheduler, needs to be called with Meteor.call in both resources (when a reservation is made) and in reservations (when a reservation can be updated) to actually send the email notifications.  Based on: http://richsilv.github.io/meteor/scheduling-events-in-the-future-with-meteor/
Meteor.startup(function() {
	process.env.MAIL_URL="smtp://dukeresourceful%40gmail.com:HelloWorld@smtp.gmail.com:465/"; 
	UpcomingReservations.find().forEach(function(mail) {
		if (mail.date < new Date()) {
			sendMail(mail)
            UpcomingReservations.remove(mail._id);
		} else {
			addTask(mail._id, mail);
		}
	});
	SyncedCron.start();

});

UpcomingReservations = new Meteor.Collection('upcomingreservations'); // server-side only

function sendMail(details) {

	    Email.send({
	        from: details.from,
	        to: details.to,
	        subject: details.subject,
	        text: details.text,
	    });
	    
	}

function addTask(id, details) {

		SyncedCron.add({
			name: id,
			schedule: function(parser) {
				return parser.recur().on(details.date).fullDate();
			},
			job: function() {
				sendMail(details);
				UpcomingReservations.remove(id);
				SyncedCron.remove(id);
		        return id;
			}
		});

	}

Meteor.methods({	
	'scheduleMail':function(details) { 

		if (details.date < new Date()) {
			sendMail(details);
		} else {
	        console.log("added");
			var thisId = UpcomingReservations.insert(details);
			addTask(thisId, details);		
		}
		return thisId;
	}
});

Meteor.methods({
	'cancelMail':function(id) { 
		UpcomingReservations.remove(id);
	}
});