Resources = new Mongo.Collection("Resources");
Resources.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
    },
    tags: {
        type: [String],
        label: "Tags",
        optional: true
    },
    description: {
        type: String,
        label: "Description",
    },
    restricted: {
        type: Boolean,
        label: "Requires Approval"
    },
    managers: {
        type: [String],
        label: "Managers"
    },
    canReserve: {
        type: [String],
        label: "Can Reserve",
        optional: true
    },
    canView: {
        type: [String],
        label: "Can View",
        optional: true
    },
    sharing: {
        type: String,
        allowedValues: ['exclusive', 'limited', 'unlimited']
    },
    limit: {
        type: Number,
        min: 2,
        defaultValue: 2,
        label: "Reservation Limit",
        optional: true
    }
}));