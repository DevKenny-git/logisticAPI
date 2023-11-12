const mongoose = require("mongoose");

const connectedUsers = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    socketId: {
        type: String,
        required: true
    }
}, {timestamps: true});

const connectedUsersCollection = mongoose.model("connectedUsers", connectedUsers);

module.exports = {
    connectedUsersCollection
}