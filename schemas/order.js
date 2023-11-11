const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const orderSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    destinationAddress: {
        type: String,
        required: true
    },
    itemWeight: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    riderId: {
        type: String,
        default: null
    },
    costOfShipping: {
        type: Number,
        default: 1000
    },
    status: {
        type: String,        
        enum: ["pending", "in-transit", "delivered"],
        default: "pending"
    }
},
{
    timestamps: true
});

orderSchema.plugin(paginate);
const orderCollection = mongoose.model("order", orderSchema);

module.exports = {
    orderCollection
}