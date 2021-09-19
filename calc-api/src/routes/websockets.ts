import WebSocket, { Server } from "ws";

export default (httpServer: Server) => {
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

  return wsServer;
};
