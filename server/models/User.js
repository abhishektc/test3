const { Schema, model } = require("mongoose");

const UsersSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: Number
        },
        role: {
            type: String,
            default: "CUSTOMER",
            enum: ["CUSTOMER", "AGENT", "ADMIN"]
        },
    },
    { timestamps: true }
);

module.exports = model("user", UsersSchema);
