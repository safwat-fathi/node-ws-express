import { WebSocket, Server as WebSocketServer } from "ws";
import { Server, IncomingMessage, ServerResponse } from "http";

type WSClients = Set<WebSocket>;
type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;
type WSServer = WebSocketServer<WebSocket>;

export class WebSocketStore {
  public clients: WSClients;
  public wsServer: WSServer;
  // private _server: HttpServer

  constructor(server: HttpServer) {
    // this._server = server
    this.wsServer = new WebSocket.Server({ server });
    this.clients = this.wsServer.clients;
  }

  init() {
    this.wsServer.emit("connection");
  }

  event(
    evType: string,
    cb?: (ws: WebSocket, request: IncomingMessage) => void
  ) {
    // this.wsServer.on("close", )
    this.wsServer.on("connection", (socket, req) => {
      socket.send("Hi there, I am a WebSocket server");
    });
  }
}
