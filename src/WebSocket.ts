/*
	TODO: add to WebSocketServer class
	- implement rooms
	- send method
	- broadcast method
 */
import { _WebSocket } from "./types/ws";
import {
  EventListenerOptions,
  RawData,
  Data,
  WebSocket,
  Server as WSS,
} from "ws";
import {
  Server as HttpServer,
  IncomingMessage,
  IncomingHttpHeaders,
} from "http";
// import uuid from 'uuid'

type WebSocketClients = Set<WebSocket>;
// type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;
// type WSServer = WebSocketServer<_WebSocket>;

export class WebSocketServer {
  // public clients: WebSocketClients;
  // public wsServer: WSServer;
  // // private _server: HttpServer

  // constructor(server: HttpServer) {
  //   // this._server = server
  //   this.wsServer = new _WebSocket.Server({ server });
  //   this.clients = this.wsServer.clients;
  // }

  // init() {
  //   this.wsServer.emit("connection");
  // }

  // event(
  //   evType: string,
  //   cb?: (ws: _WebSocket, request: IncomingMessage) => void
  // ) {
  //   // this.wsServer.on("close", )
  //   this.wsServer.on("connection", (socket, req) => {
  //     socket.send("Hi there, I am a _WebSocket server");
  //   });
  // }
  private readonly _wss: WSS;
  private readonly _clients: WebSocketClients;

  constructor(httpServer: HttpServer) {
    this._wss = new WebSocket.Server({ server: httpServer });
    this._clients = this._wss.clients;

    this._attachEventListeners();
  }

  listen(
    event: "connection" | "error" | "close",
    cb: (
      _WebSocket: WSS,
      socket: _WebSocket,
      req: IncomingMessage,
      headers: IncomingHttpHeaders
    ) => void
  ) {
    // this._wss.(event, cb);
  }

  init(cb: () => void) {
    this._wss.once("connection", cb);
  }

  send(
    payload: { id: number; message: string },
    socket: _WebSocket,
    req: IncomingMessage
  ) {
    let senderId = this._clients.forEach(client => {
      if (client === socket) {
        client.send(`Message from: ${payload.id}  -> ${payload.message}`);
      }
    });
  }

  broadcast(payload: string, socket: _WebSocket) {
    this._clients.forEach(client => {
      if (client !== socket && client["readyState"] === WebSocket["OPEN"]) {
        client.send(`Hello, broadcast message -> ${payload}`);
      }
    });
  }

  private _attachEventListeners(): void {
    this._wss.on("connection", (socket: _WebSocket, req: IncomingMessage) => {
      let clientId = req.headers["sec-websocket-key"];
      socket.id = <string>clientId;

      console.log(`client with id: ${clientId} connected`);

      // When a message is received from the client
      socket.on("message", (data: RawData) => {
        console.log(`Message received from client : ${data}`);

        // Send back a response to the client with some data
        socket.send(JSON.stringify({ sender: socket.id }));
      });

      // When the connection is closed
      socket.on("close", () => {
        console.log(`client with clientId ${clientId} connection closed`);
      });
    });

    // this._wss.on("close", )
  }

  // private receive(msg: Data, cb) {}
}
