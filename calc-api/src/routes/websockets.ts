import WebSocket, { Server } from "ws";
import { ItemEventEmitter } from "../db/ItemEventEmitter";

export default (httpServer: Server, ee: ItemEventEmitter) => {
  const wsServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });

  httpServer.on("upgrade", (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (websocket) => {
      wsServer.emit("connection", websocket, request);
    });
  });

  wsServer.on("connection", (socket, request) => {
    console.log("connected");

    socket.on("message", (data) => {
      const message = data.toString();
      console.log("received", message);
      setTimeout(() => {
        socket.send(message);
      }, 500);
    });
  });

  ee.on("updated", (item) => {
    wsServer.clients.forEach((ws) => {
      ws.send(JSON.stringify(item));
    });
  });

  return wsServer;
};
