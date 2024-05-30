"use client";

import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MotionValue, useMotionValue } from "framer-motion";

import { COLORS_ARRAY } from "@/constants/colors";
import { useUser } from "@clerk/nextjs";
import { useSocket } from "./socket-provider";
// import { useSetRoom, useRoom } from "@/common/recoil/room/room.hooks";
import { Move, User } from "@/types";
import { useRoomStore } from "@/lib/hooks/use-room-store";
import { toast } from "sonner";

export const roomContext = createContext<{
  x: MotionValue<number>;
  y: MotionValue<number>;
  undoRef: RefObject<HTMLButtonElement>;
  redoRef: RefObject<HTMLButtonElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  bgRef: RefObject<HTMLCanvasElement>;
  selectionRefs: RefObject<HTMLButtonElement[]>;
  minimapRef: RefObject<HTMLCanvasElement>;
  drawHistory: RefObject<any>;
  historyPointer: RefObject<number | null>;
  shouldDraw: RefObject<boolean>;
}>(null!);

export const useRoom = () => {
  return useContext(roomContext);
};

const RoomContextProvider = ({
  children,
  room,
}: {
  children: React.ReactNode;
  room: any;
}) => {
  //   const setRoom = useSetRoom();
  //   const { users } = useRoom();

  //   const { handleAddUser, handleRemoveUser } = useSetUsers();

  const { socket } = useSocket();

  const { user } = useUser();

  const undoRef = useRef<HTMLButtonElement>(null);
  const redoRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const selectionRefs = useRef<HTMLButtonElement[]>([]);
  const drawHistory = useRef<any>([]);
  const historyPointer = useRef<number>(0);
  const shouldDraw = useRef<boolean>(false);

  const { Room, addUser, removeUser } = useRoomStore();
  // const { drawHistory } = Room;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { setRoom } = useRoomStore();

  useEffect(() => {
    if (!user || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    setRoom(room.id, room.name, room.userId);
    socket.emit("joinRoom", room.id);
    socket.on("new_user", () => {
      addUser(user.id, user.firstName!, user.imageUrl);
      toast(`${user.firstName} Joined.`);
      // socket.emit("roomData", { drawings });
    });

    socket.on("user_disconnected", () => {
      removeUser(user.id);
      toast(`${user.firstName} Left.`);
    });

    // drawHistory.forEach((drawing) => {
    //   context.drawImage(drawing.image, drawing.x, drawing.y);
    // });
    // if (drawHistory) {
    //   context?.putImageData(drawHistory, 0, 0);
    // }

    return () => {
      socket.off("new_user");
      socket.off("user_disconnected");
    };
  }, [user?.id]);

  return (
    <roomContext.Provider
      value={{
        x,
        y,
        bgRef,
        undoRef,
        redoRef,
        canvasRef,
        drawHistory,
        shouldDraw,
        historyPointer,

        minimapRef,
        selectionRefs,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomContextProvider;
