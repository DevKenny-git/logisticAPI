const mongoose = require("mongoose");
const { setTheUsername } = require("whatwg-url");

const ridersSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "rider"
    }

},
{
    timestamps: setTheUsername
});

const ridersCollection = mongoose.model("Riders", ridersSchema);

module.exports = {
    ridersCollection
}