const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {botMessage,  formatMessage} = require("./utils/messages")



require("dotenv").config();

const {
  userLeave,
  getRoomUsers,
} = require("./utils/users"); 
const ordercontroller = require("./controller");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

ordercontroller.fullOrderLogic(io)

// Set static folder
app.use(express.static(path.join(__dirname, "public")));



//const io = socketio(server);

//convert a connect middleware to a Socket.IO middleware



/*
const botName = "ChatCord Bot";

const username = 'dinma'
io.on("connection", (socket) => {
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
  

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
   users.push({
     userID: id,
     username: socket.username || username,
    });
  }
  //console.log(users,"users")
    let deviceID
  //get device ID
   
  socket.on('deviceId', deviceId => {
    console.log(deviceId, "deviceid iddddddddd")
    deviceID = deviceId
    
    })
   const room = "room1"
     socket.join(room)
    
 // console.log(users,"userssssss")
  //io.to(room).emit("users", users);
     
   // Welcome current user when user joins room
   
   io.to(room).emit("message", formatMessage(botName, botMessage)); 
   


  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {  

    io.to(room).emit("message", formatMessage(username, msg));
    
    console.log(msg, "message", Number.isInteger(msg), parseInt(msg), deviceID)

    socket.on('deviceid', deviceId => {
      console.log(deviceId, "deviceid iddddddddd")
    
       ordercontroller.orderLogic({io,msg, deviceID : deviceId,room, botName})
      })
      ordercontroller.orderLogic({io,msg, deviceID,room, botName})
     
  });

  // Runs when client disconnects
  socket.on("disconnect", ()  => {
    const user = userLeave(socket.id)
 
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      io.to(room).emit("message", formatMessage(botName, "Left the ChatCord!"));

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });  
});
*/

module.exports = {server, io}