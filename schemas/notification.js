const mongoose = require("mongoose");

const notificationShema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Riders",
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true});

const notificationCollection = mongoose.model("messages", notificationShema);

module.exports = {
    notificationCollection
}