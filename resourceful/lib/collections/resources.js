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
    canReserve: {
        type: [String],
        label: "Can Reserve",
        optional: true
    },
    canView: {
        type: [String],
        label: "Can View",
        optional: true
    }
}));