const mongoose = require("mongoose");

const messageShema = new mongoose.Schema({
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

const messagesCollection = mongoose.model("messages", messageShema);

module.exports = {
    messagesCollection
}