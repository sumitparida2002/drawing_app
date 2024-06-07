"use client";

import { useRef } from "react";

import { motion } from "framer-motion";
import { useInterval, useMouse } from "react-use";

import { useSocket } from "@/providers/socket-provider";
import { useBoardPosition } from "@/hooks/use-board-pos";
import { getPos } from "@/lib/get-pos";

const MousePosition = () => {
  const { socket } = useSocket();
  const { x, y } = useBoardPosition();

  const prevPosition = useRef({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  const { docX, docY } = useMouse(ref);

  useInterval(() => {
    if (prevPosition.current.x !== docX || prevPosition.current.y !== docY) {
      socket.emit("mouse_moved", getPos(docX, x), getPos(docY, y));
      prevPosition.current = { x: docX, y: docY };
    }
  }, 150);

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute top-0 left-0 z-50 select-none transition-colors dark:text-white"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.05, ease: "linear" }}
    >
      {getPos(docX, x).toFixed(0)} | {getPos(docY, y).toFixed(0)}
    </motion.div>
  );
};

export default MousePosition;
