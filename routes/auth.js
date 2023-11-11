const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const joi = require('joi');
require("dotenv").config();
const {customerCollection} = require("../schemas/customers");
const {ridersCollection} = require("../schemas/riders");

const bcrypt = require("bcrypt");


router.post("/customer-register", async (req, res) => {
    const {fullname, email, password, role} = req.body;

    const registerValidation = joi.object({
        fullname: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(6),
        role: joi.string()
    });

    const {error: validationError} = registerValidation.validate({fullname, email, password});
    
    if (validationError) return res.send(validationError); 

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    await customerCollection.create({
        fullname,
        email,
        password: hashedPassword,
        role
    });

    res.status(201).send("Customer Successfully registered");

});

router.post("/riders-register", async (req, res) => {
    const {fullname, email, password, role} = req.body;

    const validationSchema = joi.object({
        fullname: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(6),
        role: joi.string()
    })

    const {error: validationError} = validationSchema.validate({fullname, email, password});

    if (validationError) return res.send(validationError);

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    await ridersCollection.create({
        fullname,
        email,
        password: hashedPassword,
        role
    });

    res.status(201).send("Rider Successfully Registered");
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const user = await customerCollection.findOne({email}) || await ridersCollection.findOne({email});

    if (!user) return res.send("User not Found");

    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) return res.status(404).send("Invalid Login Credentials");

    const {email: userEmail, _id, role} = user;

    const token = jwt.sign({
        email: userEmail,
        userId: _id,
        role
    }, process.env.SECRET);

    res.send({
        message: "Login Successful",
        token
    });
});




module.exports = router;