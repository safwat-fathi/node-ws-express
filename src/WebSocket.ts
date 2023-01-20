/*
	TODO: add to WebSocketServer class
	- implement rooms
	- send method
	- broadcast method
 */
// import { WebSocket } from "./types/ws";
import { RawData, WebSocket, Server as WSS } from "ws";
import { Server as HttpServer, IncomingMessage } from "http";
// import uuid from 'uuid'

type WebSocketClients = Set<WebSocket>;

export default class WebSocketServer {
  private static _instance: WebSocketServer | null = null;
  private readonly _wss: WSS;
  private _clients: WebSocketClients;

  constructor(httpServer: HttpServer) {
    this._wss = new WebSocket.Server({ server: httpServer });
    this._clients = this._wss.clients;

    this._attachEventListeners();
  }

  public static init(httpServer: HttpServer) {
    if (this._instance === null) {
      this._instance = new WebSocketServer(httpServer);
    }

    return this._instance;
  }

  // listen(
  //   event: "connection" | "error" | "close",
  //   cb: (
  //     WebSocket: WSS,
  //     socket: WebSocket,
  //     req: IncomingMessage,
  //     headers: IncomingHttpHeaders
  //   ) => void
  // ) {
  //   // this._wss.(event, cb);
  // }

  // init(cb: () => void) {
  //   this.wss.once("connection", cb);
  // }

  send(
    payload: { id: string; message: string },
    socket: WebSocket
    // req: IncomingMessage
  ) {
    let senderId = payload.id;

    this._clients.forEach(client => {
      if (client !== socket) {
        client.send(`Message from: ${senderId} -> ${payload.message}`);
      }
    });
  }

  broadcast(payload: string, socket: WebSocket) {
    this._clients.forEach(client => {
      if (client !== socket && client["readyState"] === WebSocket["OPEN"]) {
        client.send(`Hello, broadcast message -> ${payload}`);
      }
    });
  }

  private _attachEventListeners(): void {
    this._wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
      let clientId = req.headers["sec-websocket-key"];
      // this._clients = this._wss.clients;
      this._clients.add(socket);

      console.log(`client with id: ${clientId} connected`);

      // When a message is received from the client
      socket.on("message", (data: RawData) => {
        console.log(`Message: "${data}" received from client`);

        // Send back a response to the client with some data
        // console.log(this._clients);
      });

      // When the connection is closed
      socket.on("close", () => {
        console.log(`client with clientId ${clientId} connection closed`);
      });
    });

    this._wss.on("close", () => {
      console.log("Server closed");
    });
  }
}
