const express = require("express");
const app = express();
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
require("dotenv").config();
const port = 3000 || process.env.PORT;
const orderRoute = require("./routes/order");
const {notificationCollection} = require("./schemas/notification");
const {createServer} = require('http');
const { ioController } = require("./routes/middleware");
const { ridersCollection } = require("./schemas/riders");
const { customerCollection } = require("./schemas/customers");
const { orderCollection } = require("./schemas/order");
const { connectedUsersCollection } = require("./schemas/connectedUser");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
    const token = socket.request.headers.auth;

    const {err, user} = ioController(token);

    if (err) return socket.emit("error", "an error occurred while trying to authenticate");

    socket.request.userDetails = user;

    next();
})


io.on('connection', async (socket) => {
    const socketId = socket.id;
    const userDetails = socket.request.userDetails;

    const user = await connectedUsersCollection.create({
        user: userDetails.userId,
        socketId
    });
    
    const onlineUser = await customerCollection.findById(userDetails.userId) || await ridersCollection.findById(userDetails.userId);
    socket.broadcast.emit("user-online", `${onlineUser.fullname}`);


    socket.on('send-message', async (payload, callback) => {
        try {
            const messageNotification = await orderCollection.findOne({riderId:  userDetails.userId});
            await notificationCollection.create({
                sender: userDetails.userId,
                chatId: payload.chatId,
                receiver: payload.userId,
                message: messageNotification.status
            });     
            
            const user = await orderCollection.find({customer: payload.userId}, "socketId");

            const userSocketIds = user.map(socketId => {
                return socketId.socketId;
            });

            socket.to(userSocketIds).emit("notification", {
                message: messageNotification.status
            })
            callback({
                successful: true,
                message
            });
        } catch (err) {
            console.log (err);
        }
    });

    socket.on("disconnect", async (reason) => {
        await connectedUsersCollection.findOneAndDelete({socketId});
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
