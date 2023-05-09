const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const WebSocket = require("websocket").server;

app.use(express.static("public"));

const http = require("http");
const server = http.createServer(app);
const wsServer = new WebSocket({
  httpServer: server,
});

const clients = new Map();

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const clientId = new Date().getTime();
  clients.set(clientId, connection);

  console.log(`Client ${clientId} connected`);

  connection.on("message", (message) => {
    if (message.type === "utf8") {
      const data = JSON.parse(message.utf8Data);
      data.clientId = clientId;

      for (const [id, clientConnection] of clients.entries()) {
        if (id !== clientId) {
          clientConnection.send(JSON.stringify(data));
        }
      }
    }
  });

  connection.on("close", () => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
