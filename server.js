const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");



require("dotenv").config();

const {
  
} = require("./utils/users"); 
const ordercontroller = require("./controller");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

ordercontroller.fullOrderLogic(io)

// Set static folder
app.use(express.static(path.join(__dirname, "public")));



module.exports = {server, io}