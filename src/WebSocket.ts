/*
	TODO: add to WebSocketServer class
	- implement rooms
	- send method
	- broadcast method
 */
// import { WebSocket } from "./types/ws";
import { RawData, WebSocket, Server as WSS } from "ws";
import { Server as HttpServer, IncomingMessage } from "http";
import { serialize, deserialize } from "bson";
// import uuid from 'uuid'

type WebSocketClient = WebSocket & { id: string };
type WebSocketClients = Set<WebSocketClient>;

export default class WebSocketServer {
  private static _instance: WebSocketServer | null = null;
  private readonly _wss: WSS;
  private _clients: WebSocketClients;

  constructor(httpServer: HttpServer) {
    this._wss = new WebSocket.Server({ server: httpServer });
    this._clients = new Set();

    this._attachEventListeners();

    process.on("unhandledRejection", err => {
      console.log("Server error", err);
      this._wss.close(() => process.exit(1));
    });
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
    socket: WebSocketClient
    // req: IncomingMessage
  ) {
    let senderId = payload.id;

    this._clients.forEach(client => {
      if (
        client !== socket &&
        client.readyState === WebSocket.OPEN &&
        senderId === client.id
      ) {
        client.send(`Message from: ${senderId} -> ${payload.message}`);
      }
    });
  }

  broadcast(payload: any, socket: WebSocketClient) {
    this._clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(`Hello, broadcast message -> ${payload}`);
      }
    });
  }
  // {type: "broadcast", payload: "THIS IS A BROADCAST MESSAGE!"}

  private _attachEventListeners(): void {
    this._wss.on(
      "connection",
      (socket: WebSocketClient, req: IncomingMessage) => {
        socket.id = <string>req.headers["sec-websocket-key"];
        // this._clients = this._wss.clients;
        this._clients.add(socket);

        console.log(`client with id: ${socket.id} connected`);

        // When a message is received from the client
        socket.on("message", (data: RawData, isBinary: boolean) => {
          try {
            const msg: { type: string; payload: any } = JSON.parse(
              data.toString("utf-8")
            );

            console.log("received message type: ", msg.type);
            console.log("received message payload: ", msg.payload);
            if (msg.type === "broadcast") this.broadcast(msg.payload, socket);
            if (msg.type === "private") this.send(msg.payload, socket);
            // Send back a response to the client with some data
            // console.log(this._clients);
          } catch (err) {
            console.log("Error parsing object: ", data.toString("utf-8"));
          }
        });

        // When the socket connection is closed
        socket.on("close", () => {
          console.log(`client with clientId ${socket.id} connection closed`);
        });
      }
    );

    this._wss.on("close", () => {
      console.log("Server closed");
    });

    this._wss.on("error", (err: Error) => {
      console.log("Server error", err);
      this._wss.close(() => process.exit(1));
    });
  }
}
