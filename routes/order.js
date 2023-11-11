const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {orderCollection} = require("../schemas/order");
require("dotenv").config();
const {isRider, isCustomer, isSignedIn} = require("./middleware");
const mongoose = require("mongoose");

router.post("/", isSignedIn, isCustomer, async (req, res) => {
    const {itemName,
        customerAddress,
        destinationAddress,
        itemWeight,
        costOfShipping,
        status
    } = req.body;

    console.log(req.decoded.userId);
    const newOrder = await orderCollection.create({
      itemName,
      customerAddress,
      destinationAddress,
      itemWeight,
      costOfShipping,
      status,
      customer: req.decoded.userId
    })
    res.send({
        isRequestSuccessful: true,
        newOrder
    })
});

router.get("/", isSignedIn, isCustomer, async (req, res) => {
    const allOrder = await orderCollection.find({customer: req.decoded.userId});
    res.json({allOrder});
});

router.put("/status/:id", isSignedIn, isRider, async (req, res) => {
    const {status} = req.body;
    try { 
        const orderToUpdate =  await orderCollection.findById(req.params.id);
        if (!orderToUpdate) return res.status(401).send("Item not found");
        console.log(orderToUpdate._id);

        await orderCollection.findByIdAndUpdate(orderToUpdate._id, {
            status,
            riderId: req.decoded.userId.toString()
        }, {new: true});
        res.send({message: "Status updated successfully"});
    } catch(error) {
        console.log(error.message);
    }
})

router.get("/view", isSignedIn, isRider, async (req, res) => {
    try {
        console.log(req.decoded.userId);
        const allOrder = await orderCollection.findOne({riderId: req.decoded.userId}).lean();        
        res.json(allOrder.sort({createdAt: -1}));
    } catch(error) {
        console.log(error.message);
    }
    
})

module.exports = router;