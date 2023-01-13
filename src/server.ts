import express from "express";
import http from "http";
import { WebSocket } from "ws";
import { WebSocketStore } from "./WebSocket";

const app = express();

const server = http.createServer(app);
const webSocketStore = new WebSocketStore(server);
// import "./WebSocket";

// initialize the WebSocket server instance
// const wss = new WebSocket.Server({ server });
// const wss = webSocketStore.wsServer
webSocketStore.init();
webSocketStore.event("connection");
// webSocketStore.init();
// wss.on("connection", (ws: WebSocket) => {
//   ws.on("message", message => {
//     wss.clients.forEach(client => {
//       if (client !== ws) {
//         client.send(`Hello, broadcast message -> ${message}`);
//       }
//     });
//     console.log("received: %s", message);
//     // ws.send(`Hello, you sent -> ${message}`);
//   });

//   //send immediatly a feedback to the incoming connection
//   ws.send("Hi there, I am a WebSocket server");
// });

// wss.on("close", (ws: WebSocket) => {
//   // ws
//   console.log("connection closed");
// });

// start our server
server.listen(process.env.PORT || 9000, () => {
  console.log(`Server started`);
});
