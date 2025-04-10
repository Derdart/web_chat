// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let users = {}; // To store user names and their associated socket IDs

// When a user connects
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle setting a user name
  socket.on("set name", (name) => {
    users[socket.id] = { name, room: null }; // Store user name and current room
    console.log(`${name} has joined the chat`);
  });

  // Handle user joining a room
  socket.on("join room", (room) => {
    const user = users[socket.id];
    if (user) {
      if (user.room) {
        socket.leave(user.room); // Leave the old room
      }
      socket.join(room); // Join the new room
      user.room = room;
      io.to(room).emit(
        "chat message",
        `${user.name} has joined the room ${room}`
      );
    }
  });

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    const user = users[socket.id];
    if (user && user.room) {
      io.to(user.room).emit("chat message", `${user.name}: ${msg}`);
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user && user.room) {
      io.to(user.room).emit("chat message", `${user.name} has left the room`);
    }
    delete users[socket.id];
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
