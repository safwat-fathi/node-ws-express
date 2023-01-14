import { WebSocket } from "ws";

export interface _WebSocket extends WebSocket {
  id: string;
}
