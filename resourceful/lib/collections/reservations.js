Reservations = new Mongo.Collection("Reservations");
SimpleSchema.messages({
  "resStartInvalid": "Start must be before end!",
    "inPast": "Start time must be in the future!"
});
Reservations.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        label: "User Id"
    },
    email: {
        type: String,
        label: "Email"
    },
    start: {
        type: Date,
        label: "Start",
        custom: function () {
            if (this.value < new Date()) {
                return "inPast";
            }
        }
    },
    end: {
        type: Date,
        label: "End",
        custom: function () {
            if (this.value < this.field('start').value) {
                return "resStartInvalid";
            }
        }
    },
    startEmailId: {
        type: String,
        label: "startId",
        optional: true
    },
    endEmailId: {
        type: String,
        label: "endId",
        optional: true
    },
    resourceId: {
        type: String,
        label: "Resource Id"
    },
    description: {
        type: String,
        label: "Description"
    }
}));