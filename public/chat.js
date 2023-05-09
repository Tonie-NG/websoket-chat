const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

const serverUrl = "ws://" + window.location.hostname + ":3001";
const socket = new WebSocket(serverUrl);

socket.onopen = () => {
  console.log("Connected to the chat server");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  addMessageToChat(data);
};

socket.onclose = () => {
  console.log("Disconnected from the chat server");
};

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(chatInput.value);
  chatInput.value = "";
});

function sendMessage(text) {
  if (!text.trim()) return;
  const message = {
    type: "text",
    content: text,
  };
  socket.send(JSON.stringify(message));
}

function addMessageToChat(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.textContent = `Client ${message.clientId}: ${message.content}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
