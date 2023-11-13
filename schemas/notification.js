const mongoose = require("mongoose");

const notificationShema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    sender: {
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