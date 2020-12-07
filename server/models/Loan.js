const { ObjectId } = require("mongodb");
const { Schema, model } = require("mongoose");

const LoansSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        intrest: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        totalIntrest: {
            type: Number,
            required: true
        },
        emi: {
            type: Number,
            required: true
        },
        customerId: {
            type: ObjectId,
            ref: 'user'
        },
        agentId: {
            type: ObjectId,
            ref: 'user'
        },
        state: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = model("loans", LoansSchema);
