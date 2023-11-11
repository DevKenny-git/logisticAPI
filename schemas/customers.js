const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
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
        default: "customer"
    }
}, 
{
    timestamps: true
});

const customerCollection = mongoose.model('Customer', customerSchema);

module.exports = {
    customerCollection
}