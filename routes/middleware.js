require("dotenv").config();
const jwt = require("jsonwebtoken");


function isSignedIn(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.status(401).send("Unauthorized User");

    const value = authorizationHeader.split(" ");

    const tokenType =  value[0];
    const tokenValue = value[1];

    if (tokenType == "Bearer") {
        const decoded = jwt.verify(tokenValue, process.env.SECRET);
        req.decoded = decoded;
        next();
        return;
    }
    res.status(401).send("Not Authorized");
}


function isRider(req, res, next) {
    if (req.decoded.role == "rider") {
        next();
    } else {
        res.status(401).send("You are not a rider");
    }
}

function isCustomer(req, res, next) {
    console.log(req.decoded);
    if (req.decoded.role == "customer") {
        next();
    } else {
        res.status(401).send("You are not a customer");
    }
}


function ioController(token) {
    const [tokenType, jwtKey] = token.split(" ");

    if (tokenType == "Bearer") {
        const userDetails = jwt.verify(jwtKey, process.env.SECRET);

        return {
            error: null,
            user: userDetails
        }
    } else {
        return {
            error: {
                message: "No valid token"
            },
            user: null
        }
    }
}


module.exports = {
    isRider, 
    isCustomer,
    isSignedIn,
    ioController
}