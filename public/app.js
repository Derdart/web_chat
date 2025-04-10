// app.js
const socket = io();

let username = "";
let currentRoom = "";

// Elements
const loginContainer = document.getElementById("login-container");
const chatContainer = document.getElementById("chat-container");
const usernameInput = document.getElementById("username");
const roomSelect = document.getElementById("room-select");
const joinButton = document.getElementById("join-btn");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const messagesDiv = document.getElementById("messages");

// Join Room
joinButton.addEventListener("click", () => {
  username = usernameInput.value;
  currentRoom = roomSelect.value;

  if (username) {
    socket.emit("set name", username); // Set the user's name
    socket.emit("join room", currentRoom); // Join the selected room

    loginContainer.style.display = "none";
    chatContainer.style.display = "block";
  } else {
    alert("Please enter a username");
  }
});

// Send Message
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    socket.emit("chat message", message); // Send message to server
    messageInput.value = ""; // Clear input
  }
});

// Display messages
socket.on("chat message", (msg) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = msg;
  messagesDiv.appendChild(messageElement);

  // Scroll to the bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
