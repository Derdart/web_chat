const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

// Handle user connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // When user joins a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Listen for messages from the client
  socket.on("sendMessage", (data) => {
    const { room, message } = data;
    io.to(room).emit("messageReceived", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
