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
    }
}));