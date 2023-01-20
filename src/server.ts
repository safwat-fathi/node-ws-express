import express from "express";
import http from "http";
import WebSocketServer from "./WebSocket";

const app = express();

const server = http.createServer(app);
WebSocketServer.init(server);

// start our server
server.listen(process.env.PORT || 9000, () => {
  console.log(`Server started`);
});
