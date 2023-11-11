const express = require("express");
const app = express();
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
require("dotenv").config();
const port = 3000 || process.env.PORT;
const orderRoute = require("./routes/order");
const {messagesCollection} = require("./schemas/messages");
const {createServer} = require('http');
const { ioController } = require("./routes/middleware");
const { ridersCollection } = require("./schemas/riders");
const { customerCollection } = require("./schemas/customers");
const { orderCollection } = require("./schemas/order");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
    const token = socket.requests.headers.auth;

    const {err, user} = ioController(token);

    if (err) return socket.emit("error", "an error occurred while trying to authenticate");

    socket.request.userDetails = user;

    next();
})


io.on('connection', async (socket) => {
    const socketId = socket.id;
    const userDetails = socket.request.userDetails;

       
    const onlineUser = await customerCollection.findById(userDetails.userId) || await ridersCollection.findById(userDetails.userId);
    socket.broadcast.emit("user-online", `${onlineUser.fullname}`);


    socket.on('send-message', async (payload, callback) => {
        const messageNotification = await orderCollection.findOne({riderId:  userDetails.userId});
        await messagesCollection.create({
            sender: userDetails.userId,
            chatId: payload.chatId,
            receiver: payload.userId,
            message: messageNotification.status
        });     
        
        const user = await ordersCollection.find({user: payload.userId}, "socketId");

        const userSocketIds = user.map(socketId => {
            return socketId.socketId;
        });

        socket.to(userSocketIds).emit("notification", {
            message: messageNotification.status
        })
        callback({
            successful: true,
            message: "Your message has been sent"
        });
    });
    
    socket.on("disconnect", async (reason) => {
        await connectedUserCollection.findOneAndDelete({socketId});
    });
});






const connect = mongoose.connect(process.env.MONGOURL)
connect.then(() => {

    console.log("Database Succesfully Connected");
})
.catch((error) => {
    console.log("Error connecting to the database " + error);
})

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use("/v1/auth", authRoute);
app.use("/v1/order", orderRoute);

httpServer.listen(port, () => {
    console.log("REST and socket.io listening on port", port);
})
