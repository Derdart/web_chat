const socket = io("http://localhost:3000"); // Connect to the server

// Join room event
document
  .getElementById("joinRoomButton")
  .addEventListener("click", function () {
    const roomName = document.getElementById("roomInput").value;

    if (roomName) {
      socket.emit("joinRoom", roomName);
      document.getElementById("roomName").textContent = roomName;
      document.getElementById("roomInput").disabled = true;
    }
  });

// Send message event
document.getElementById("sendButton").addEventListener("click", function () {
  const message = document.getElementById("messageInput").value;
  const roomName = document.getElementById("roomName").textContent;

  if (message) {
    socket.emit("sendMessage", { room: roomName, message });
    document.getElementById("messageInput").value = ""; // Clear input
  }
});

// Listen for messages from the server
socket.on("messageReceived", function (message) {
  const messageContainer = document.getElementById("messages");

  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);
});
