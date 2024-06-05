"use client";

import { useRoom } from "@/providers/room-provider";
import { useSocket } from "@/providers/socket-provider";
import { Move } from "@/types";
import { useEffect } from "react";
import { useRoomStore } from "./use-room-store";

export const useSocketDraw = (drawing: boolean) => {
  const { addMoveToUser, removeMoveFromUser } = useRoomStore();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    let moveToDrawLater: Move | undefined;
    let userIdLater = "";

    socket.on("user_draw", (move, userId) => {
      console.log("in draw 2");
      if (!drawing) {
        addMoveToUser(userId, move);
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off("user_draw");

      if (moveToDrawLater && userIdLater) {
        addMoveToUser(userIdLater, moveToDrawLater);
      }
    };
  }, [drawing, addMoveToUser, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("user_undo", (userId) => {
      removeMoveFromUser(userId);
    });

    return () => {
      socket.off("user_undo");
    };
  }, [removeMoveFromUser, socket]);
};
