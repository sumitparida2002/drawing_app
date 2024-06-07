"use client";

// import {
//   createContext,
//   Dispatch,
//   RefObject,
//   SetStateAction,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { MotionValue, useMotionValue } from "framer-motion";

// import { COLORS_ARRAY } from "@/constants/colors";
// import { useUser } from "@clerk/nextjs";
// import { useSocket } from "./socket-provider";
// // import { useSetRoom, useRoom } from "@/common/recoil/room/room.hooks";
// import { Move, User } from "@/types";

// import { toast } from "sonner";
// import { useRoomStore } from "@/stores/use-room-store";

// export const roomContext = createContext<{
//   x: MotionValue<number>;
//   y: MotionValue<number>;
//   undoRef: RefObject<HTMLButtonElement>;
//   redoRef: RefObject<HTMLButtonElement>;
//   canvasRef: RefObject<HTMLCanvasElement>;
//   bgRef: RefObject<HTMLCanvasElement>;
//   selectionRefs: RefObject<HTMLButtonElement[]>;
//   minimapRef: RefObject<HTMLCanvasElement>;
//   drawHistory: RefObject<any>;
//   historyPointer: RefObject<number | null>;
//   shouldDraw: RefObject<boolean>;
// }>(null!);

// export const useRoom = () => {
//   return useContext(roomContext);
// };

// const RoomContextProvider = ({
//   children,
//   room,
// }: {
//   children: React.ReactNode;
//   room: any;
// }) => {
//   const { socket } = useSocket();

//   const { user } = useUser();

//   const undoRef = useRef<HTMLButtonElement>(null);
//   const redoRef = useRef<HTMLButtonElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const bgRef = useRef<HTMLCanvasElement>(null);
//   const minimapRef = useRef<HTMLCanvasElement>(null);
//   const selectionRefs = useRef<HTMLButtonElement[]>([]);
//   const drawHistory = useRef<any>([]);
//   const historyPointer = useRef<number>(0);
//   const shouldDraw = useRef<boolean>(false);

//   const { addUser, removeUser, setRoomId } = useRoomStore();

//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const {} = useRoomStore();

//   useEffect(() => {
//     if (!user || !canvasRef.current || socket) {
//       return;
//     }

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     socket.emit("join_room", room.id, user?.firstName);
//     socket.on("joined", (roomId: string) => {
//       setRoomId(room.id);
//     });

//     return () => {
//       socket.off("new_user");
//     };
//   }, [user?.id, socket]);

//   useEffect(() => {
//     if (socket) {
//       return;
//     }
//     socket.emit("leave_room");
//     setRoomId("");
//   }, [setRoomId, socket]);

//   return (
//     <roomContext.Provider
//       value={{
//         x,
//         y,
//         bgRef,
//         undoRef,
//         redoRef,
//         canvasRef,
//         drawHistory,
//         shouldDraw,
//         historyPointer,

//         minimapRef,
//         selectionRefs,
//       }}
//     >
//       {children}
//     </roomContext.Provider>
//   );
// };

// export default RoomContextProvider;

import {
  createContext,
  Dispatch,
  ReactChild,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MotionValue, useMotionValue } from "framer-motion";
import { toast } from "sonner";
import { useRoomStore } from "@/stores/use-room-store";
import { useSocket } from "./socket-provider";
import { COLORS_ARRAY } from "@/constants/colors";
import { Move, User } from "@/types";
import { useUser } from "@clerk/nextjs";

export const roomContext = createContext<{
  x: MotionValue<number>;
  y: MotionValue<number>;
  undoRef: RefObject<HTMLButtonElement>;
  redoRef: RefObject<HTMLButtonElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  bgRef: RefObject<HTMLCanvasElement>;
  selectionRefs: RefObject<HTMLButtonElement[]>;
  minimapRef: RefObject<HTMLCanvasElement>;
  moveImage: { base64: string; x?: number; y?: number };
  setMoveImage: Dispatch<
    SetStateAction<{
      base64: string;
      x?: number | undefined;
      y?: number | undefined;
    }>
  >;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {
  const { users } = useRoomStore();
  const { socket } = useSocket();
  const {
    setRoom,
    addUser,
    removeUser,
    id,
    myMoves,
    usersMoves,
    movesWithoutUser,
  } = useRoomStore();
  const r = useRoomStore();

  const undoRef = useRef<HTMLButtonElement>(null);
  const redoRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const selectionRefs = useRef<HTMLButtonElement[]>([]);
  const { user } = useUser();

  const [moveImage, setMoveImage] = useState<{
    base64: string;
    x?: number;
    y?: number;
  }>({ base64: "" });

  useEffect(() => {
    if (moveImage.base64 && !moveImage.x && !moveImage.y)
      setMoveImage({ base64: moveImage.base64, x: 50, y: 50 });
  }, [moveImage]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (!socket) return;
    socket.on("room", (room, usersMovesToParse, usersToParse) => {
      console.log("i gues");
      const usersMoves = new Map<string, Move[]>(JSON.parse(usersMovesToParse));
      const usersParsed = new Map<string, string>(JSON.parse(usersToParse));

      const newUsers = new Map<string, User>();

      usersParsed.forEach((name, id) => {
        if (id === socket.id) return;

        const index = Array.from(usersParsed.keys()).indexOf(id);

        const color = COLORS_ARRAY[index % COLORS_ARRAY.length];

        newUsers.set(id, {
          name,
          color,
        });
      });

      setRoom({
        id,
        myMoves,
        users: newUsers,
        usersMoves,
        movesWithoutUser: room.drawed,
      });
    });

    console.log(r);

    socket.on("new_user", (userId: string, username: string) => {
      toast(`${username} has joined the room.`);

      addUser(userId, username);
    });

    socket.on("user_disconnected", (userId: string) => {
      toast(`${users.get(userId)?.name || "Anonymous"} has left the room.`);

      removeUser(userId);
    });

    return () => {
      socket.off("room");
      socket.off("new_user");
      socket.off("user_disconnected");
    };
  }, [
    addUser,
    removeUser,
    setRoom,
    users,
    socket,
    usersMoves,
    movesWithoutUser,
  ]);

  return (
    <roomContext.Provider
      value={{
        x,
        y,
        bgRef,
        undoRef,
        redoRef,
        canvasRef,
        setMoveImage,
        moveImage,
        minimapRef,
        selectionRefs,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export const useRoom = () => {
  return useContext(roomContext);
};

export default RoomContextProvider;
