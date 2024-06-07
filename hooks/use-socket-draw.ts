"use client";

import { useEffect } from "react";

import { useSocket } from "@/providers/socket-provider";
import { Move } from "@/types";
import { useRoomStore } from "@/stores/use-room-store";

export const useSocketDraw = (drawing: boolean) => {
  const { socket } = useSocket();
  const { addMoveToUser, removeLastMoveFromUser, usersMoves } = useRoomStore();

  useEffect(() => {
    if (!socket) return;
    let moveToDrawLater: Move | undefined;
    let userIdLater = "";

    socket.on("user_draw", (move, userId) => {
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
      console.log("what");
      removeLastMoveFromUser(userId);
    });

    console.log(usersMoves);

    return () => {
      socket.off("user_undo");
    };
  }, [removeLastMoveFromUser, socket]);
};
