Reservations = new Mongo.Collection("Reservations");
Reservations.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        label: "User Id",
    },
    start: {
        type: Date,
        label: "Start"
    },
    end: {
        type: Date,
        label: "End",
    },
    resourceId: {
        type: String,
        label: "Resource Id"
    }
}));