import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";
import { Move, NextApiResponseServerIo, Room } from "@/types";
import { v4 } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

const rooms = new Map<string, Room>();
const addMove = (roomId: string, socketId: string, move: Move) => {
  const room = rooms.get(roomId)!;

  if (!room.users.has(socketId)) {
    room.usersMoves.set(socketId, [move]);
  }

  room.usersMoves.get(socketId)!.push(move);
};

const undoMove = (roomId: string, socketId: string) => {
  const room = rooms.get(roomId)!;

  room.usersMoves.get(socketId)!.pop();
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
      const getRoomId = () => {
        const joinedRoom = Array.from(socket.rooms).find(
          (room) => room !== socket.id
        );

        if (!joinedRoom) return socket.id;

        return joinedRoom;
      };

      const leaveRoom = (roomId: string, socketId: string) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const userMoves = room.usersMoves.get(socketId);

        if (userMoves) room.drawed.push(...userMoves);
        room.users.delete(socketId);

        socket.leave(roomId);
      };

      socket.on("create_room", (username) => {
        let roomId: string;
        do {
          roomId = Math.random().toString(36).substring(2, 6);
        } while (rooms.has(roomId));

        socket.join(roomId);

        rooms.set(roomId, {
          usersMoves: new Map([[socket.id, []]]),
          drawed: [],
          users: new Map([[socket.id, username]]),
        });

        console.log(rooms);

        io.to(socket.id).emit("created", roomId);
      });

      socket.on("check_room", (roomId) => {
        if (rooms.has(roomId)) socket.emit("room_exists", true);
        else socket.emit("room_exists", false);
      });

      socket.on("join_room", (roomId, username) => {
        const room = rooms.get(roomId);

        if (room && room.users.size < 12) {
          socket.join(roomId);

          room.users.set(socket.id, username);
          room.usersMoves.set(socket.id, []);

          io.to(socket.id).emit("joined", roomId, false);
        } else io.to(socket.id).emit("joined", "", true);
      });

      socket.on("joined_room", () => {
        const roomId = getRoomId();

        const room = rooms.get(roomId);
        if (!room) return;

        io.to(socket.id).emit(
          "room",
          room,
          JSON.stringify(Array.from(room.usersMoves)),
          JSON.stringify(Array.from(room.users))
        );

        console.log(roomId);

        io.to(roomId).emit(
          "new_user",
          socket.id,
          room.users.get(socket.id) || "Anonymous"
        );
      });

      socket.on("leave_room", () => {
        const roomId = getRoomId();
        leaveRoom(roomId, socket.id);

        io.to(roomId).emit("user_disconnected", socket.id);
      });

      socket.on("draw", (move) => {
        const roomId = getRoomId();

        const timestamp = Date.now();

        // eslint-disable-next-line no-param-reassign
        move.id = v4();

        addMove(roomId, socket.id, { ...move, timestamp });

        io.to(socket.id).emit("your_move", { ...move, timestamp });

        io.to(roomId).emit("user_draw", { ...move, timestamp }, socket.id);
      });

      socket.on("undo", () => {
        console.log("triiigege");
        const roomId = getRoomId();

        undoMove(roomId, socket.id);

        io.to(roomId).emit("user_undo", socket.id);
      });

      socket.on("mouse_move", (x, y) => {
        io.to(getRoomId()).emit("mouse_moved", x, y, socket.id);
      });

      socket.on("send_msg", (msg) => {
        io.to(getRoomId()).emit("new_msg", socket.id, msg);
      });

      socket.on("disconnecting", () => {
        const roomId = getRoomId();
        leaveRoom(roomId, socket.id);

        io.to(roomId).emit("user_disconnected", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
