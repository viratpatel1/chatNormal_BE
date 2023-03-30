const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const {
  addUsers,
  getUsers,
  removeUser,
  getUserInRoom,
} = require("./Componends/users");
const router = require("./Componends/router");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origins: "http://chatsapps-1.netlify.com/",
    // origins: "http://localhost:3000/",
    methods: ["GET", "POST"],
  },
});

// var server = require('http').Server(app);
// var io = require('socket.io')(server, {
//     cors:
//     {
//         origins: "http://localhost:3000/",
//         methods: ["GET", "POST"]
//     }
// });

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("join", ({ name, room }, callback) => {
    // console.log("server ", name, room);
    const { error, user } = addUsers({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, Welcome to the room ${user.room}`,
    });

    //send msg to everyone beside that specific user
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUsers(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has Left`,
      });
    }
    console.log("User Disconnected !!!");
  });
});

app.use(router);

httpServer.listen(PORT, () =>
  console.log(`Server has started on port ${PORT}`)
);
