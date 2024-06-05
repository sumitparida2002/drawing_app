import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket?.server?.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
      connectionStateRecovery: {},
    });
    io.on("connection", (socket) => {
      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);

        io.to(roomId).emit("new_user", () => {});
      });

      socket.on("mouse_moved", (x, y, roomId) => {
        socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
      });

      // socket.on("beginPath", (data) => {
      //   io.to(data.id).emit("beginPath", data);
      // });

      // socket.on("drawLine", (data) => {
      //   io.to(data.id).emit("drawLine", data);
      // });

      // socket.on("drawRect", (data) => {
      //   io.to(data.id).emit("drawRect", data);
      // });

      // socket.on("drawCircle", (data) => {
      //   io.to(data.id).emit("drawCircle", data);
      // });

      // socket.on("drawImage", (data) => {
      //   io.to(data.id).emit("drawImage", data);
      // });

      socket.on("draw", (data) => {
        let roomId = data.id;
        let move = data.move;
        const timestamp = Date.now();

        // eslint-disable-next-line no-param-reassign

        // addMove(roomId, socket.id, { ...move, timestamp });

        io.to(socket.id).emit("your_move", { ...move, timestamp });

        socket.broadcast
          .to(roomId)
          .emit("user_draw", { ...move, timestamp }, socket.id);
      });
      socket.on("disconnect", () => {
        console.log("hey disconnected");
      });
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
