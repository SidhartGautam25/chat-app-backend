const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-kappa-blush.vercel.app/",
    methods: ["GET", "POST"],
  },
});
var rooms=[];
var users=[];

io.on("connection", (socket) => {
 
  socket.on("join_room", (roomname,name) => {
    socket.join(roomname);
    console.log("user name=> "+name+" room=> "+roomname);

    if(users.includes(name)===false){
        users.push(name);
        console.log("newuser event emitted");
        io.emit("newuser",{name,socketid:socket.id});
    }
    if(rooms.includes(roomname)===false){
        rooms.push(roomname);
        console.log("server rooms=> ",rooms);
        //io.emit("newroom",{room:data});
    }
    io.emit("all-room",rooms);
    
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(8000, () => {
  console.log("running on port 8000");
});