import express from "express";
import http from "http";
import { WebSocketServer } from "./WebSocket";

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer(server);

// start our server
server.listen(process.env.PORT || 9000, () => {
  console.log(`Server started`);
});

// listen to WebSocket server when a new connection is established
wss.init(() => {
  console.log("New WebSocket connection established");
});
