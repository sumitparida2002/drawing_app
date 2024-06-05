import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { BsCursorFill } from "react-icons/bs";

import { useBoardPosition } from "@/lib/hooks/useBoardPos";
import { useRoomStore } from "@/lib/hooks/use-room-store";
import { useSocket } from "@/providers/socket-provider";

const UserMouse = ({ userId }: { userId: string }) => {
  const { Room } = useRoomStore();
  const { users } = Room;
  const boardPos = useBoardPosition();
  const { socket } = useSocket();

  const [msg, setMsg] = useState("");
  const [x, setX] = useState(boardPos.x.get());
  const [y, setY] = useState(boardPos.y.get());
  const [pos, setPos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    socket.on("mouse_moved", (newX: any, newY: any, socketIdMoved: string) => {
      if (socketIdMoved === userId) {
        setPos({ x: newX, y: newY });
      }
    });

    const handleNewMsg = (msgUserId: string, newMsg: string) => {
      if (msgUserId === userId) {
        setMsg(newMsg);

        setTimeout(() => {
          setMsg("");
        }, 3000);
      }
    };
    socket.on("new_msg", handleNewMsg);

    return () => {
      socket.off("mouse_moved");
      socket.off("new_msg", handleNewMsg);
    };
  }, [userId]);

  useEffect(() => {
    const unsubscribe = boardPos.x.onChange(setX);
    return unsubscribe;
  }, [boardPos.x]);

  useEffect(() => {
    const unsubscribe = boardPos.y.onChange(setY);
    return unsubscribe;
  }, [boardPos.y]);

  return (
    <motion.div
      className={`pointer-events-none absolute top-0 left-0 z-20 text-blue-800 ${
        pos.x === -1 && "hidden"
      }`}
      style={{ color: "violet" }}
      animate={{ x: pos.x + x, y: pos.y + y }}
      transition={{ duration: 0.2, ease: "linear" }}
    >
      <BsCursorFill className="-rotate-90" />
      {msg && (
        <p className="absolute top-full left-5 max-h-20 max-w-[15rem] overflow-hidden text-ellipsis rounded-md bg-zinc-900 p-1 px-3 text-white">
          {msg}
        </p>
      )}
      <p className="ml-2">{"Anonymous"}</p>
    </motion.div>
  );
};

export default UserMouse;
