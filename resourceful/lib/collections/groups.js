Groups = new Mongo.Collection("Groups");
Groups.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
    },
    members: {
        type: [String],
        label: "Current Members"
    },
    resourceManagers: {
        type: Boolean,
        label: "All members are Resource Managers"
    },
    userManagers: {
        type: Boolean,
        label: "All members are User Managers"
    },
    reservationManagers: {
        type: Boolean,
        label: "All members are Reservation Managers"
    }
}));
Groups.allow({
    update: function(userId, docs, fields, modifier) {
        return true;
    }
})