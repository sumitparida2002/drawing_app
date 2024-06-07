"use client";

import { useEffect, useState } from "react";

import { motion, useDragControls } from "framer-motion";
import { BsArrowsMove } from "react-icons/bs";
import { useDraw } from "@/hooks/use-draw";
import { useSocketDraw } from "@/hooks/use-socket-draw";
import { useCtx } from "@/hooks/use-ctx";
import { useBoardPosition } from "@/hooks/use-board-pos";
import { useViewportSize } from "@/hooks/use-viewport-size";
import { useRoom } from "@/providers/room-provider";
import { useMovesHandlers } from "@/hooks/use-moves-handler";
import { useSocket } from "@/providers/socket-provider";
import { CANVAS_SIZE } from "@/constants/canvasSize";
import Background from "./background";

const Canvas = () => {
  const { canvasRef, bgRef, undoRef, redoRef } = useRoom();
  const { width, height } = useViewportSize();
  const { x, y } = useBoardPosition();
  const ctx = useCtx();

  const [dragging, setDragging] = useState(true);

  const {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    clearOnYourMove,
  } = useDraw(dragging);
  useSocketDraw(drawing);
  const { socket } = useSocket();

  const { handleUndo, handleRedo } = useMovesHandlers(clearOnYourMove);

  const dragControls = useDragControls();

  useEffect(() => {
    setDragging(false);
  }, []);

  // SETUP
  useEffect(() => {
    const undoBtn = undoRef.current;
    const redoBtn = redoRef.current;

    undoBtn?.addEventListener("click", handleUndo);
    redoBtn?.addEventListener("click", handleRedo);

    return () => {
      undoBtn?.removeEventListener("click", handleUndo);
      redoBtn?.removeEventListener("click", handleRedo);
    };
  }, [canvasRef, dragging, handleRedo, handleUndo, redoRef, undoRef]);

  useEffect(() => {
    if (!socket) return;

    if (ctx) {
      socket.emit("joined_room");
    }
  }, [ctx, socket]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.canvas
        // SETTINGS
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute top-0 z-10 ${dragging && "cursor-move"}`}
        style={{ x, y }}
        // DRAG
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragControls={dragControls}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        // HANDLERS
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          console.log("huuhuu");

          if (e.button === 2) {
            setDragging(true);
            dragControls.start(e);
          } else {
            handleStartDrawing(e.clientX, e.clientY);
          }
        }}
        onMouseUp={(e) => {
          if (e.button === 2) setDragging(false);
          else handleEndDrawing();
        }}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY, e.shiftKey);
        }}
        onTouchStart={(e) =>
          handleStartDrawing(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
          )
        }
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) =>
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }
      />
      <Background bgRef={bgRef} />
      what
      <button
        className={`absolute bottom-14 right-5 z-10 rounded-xl md:bottom-5 ${
          dragging ? "bg-green-500" : "bg-zinc-300 text-black"
        } p-3 text-lg text-white`}
        onClick={() => setDragging((prev) => !prev)}
      >
        <BsArrowsMove />
      </button>
    </div>
  );
};

export default Canvas;
