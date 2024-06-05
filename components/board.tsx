"use client";

// import {
//   beginPath,
//   drawCircle,
//   drawLine,
//   drawRect,
//   rgbaToString,
// } from "@/lib/helpers/boardHelpers";
import { motion, useDragControls } from "framer-motion";
import { useToolboxStore } from "@/lib/hooks/use-toolbox-store";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

import { useSocket } from "@/providers/socket-provider";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRoomStore } from "@/lib/hooks/use-room-store";
import { useRoom } from "@/providers/room-provider";
import { useUser } from "@clerk/nextjs";
import { BsArrowsMove } from "react-icons/bs";
import { useDraw } from "@/lib/hooks/useDraw";
import { useSocketDraw } from "@/lib/hooks/useSocketDraw";

const Board = () => {
  const { socket } = useSocket();

  const [dragging, setDragging] = useState(true);
  const { width, height } = useViewportSize();
  const { isSignedIn, user } = useUser();

  const { shape } = useToolboxStore();

  const { canvasRef, shouldDraw } = useRoom();

  const {
    drawHistory,
    historyPointer,
    id,
    addDrawHistory,
    setRoom,
    setHistoryPointer,
  } = useRoomStore();

  const {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    clearOnYourMove,
  } = useDraw(dragging, id);
  useSocketDraw(drawing);

  // useEffect(() => {
  //   if (!user) return;

  //   setDragging(false);
  // }, [isSignedIn]);

  const dragControls = useDragControls();

  // useEffect(() => {
  //   if (!canvasRef.current) return;
  //   const canvas = canvasRef.current;

  //   const context = canvas.getContext("2d")!;

  //   context.strokeStyle = rgbaToString(PENCIL.color);
  //   context.lineWidth = PENCIL.size;
  //   context.fillStyle = rgbaToString(PENCIL.color);
  // }, [PENCIL.color, currentShape, PENCIL.size]);

  // useEffect(() => {
  //   if (!canvasRef.current) return;
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");
  // }, [currentShape]);

  // useLayoutEffect(() => {
  //   if (!canvasRef.current || !socket) return;

  //   const canvas = canvasRef.current as HTMLCanvasElement;
  //   const context = canvas.getContext("2d")!;

  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;

  //   let initialX: number;
  //   let initialY: number;

  //   const handleMouseDown = (e: any) => {
  //     shouldDraw.current = true;
  //     initialX = e.clientX || e.touches[0].clientX;
  //     initialY = e.clientY || e.touches[0].clientY;
  //     beginPath(
  //       context,
  //       e.clientX || e.touches[0].clientX,
  //       e.clientY || e.touches[0].clientY
  //     );

  //     socket.emit("beginPath", {
  //       x: e.clientX || e.touches[0].clientX,
  //       y: e.clientY || e.touches[0].clientY,
  //       id,
  //       user,
  //     });
  //   };

  //   const handleMouseMove = (e) => {
  //     if (!shouldDraw.current) return;

  //     const mouseX = e.clientX || e.touches[0].clientX;
  //     const mouseY = e.clientY || e.touches[0].clientY;

  //     //fix problem of series of drawings on mousemove

  //     if (currentShape === "pencil") {
  //       drawLine(
  //         context,
  //         e.clientX || e.touches[0].clientX,
  //         e.clientY || e.touches[0].clientY
  //       );
  //       socket.emit("drawLine", {
  //         x: e.clientX || e.touches[0].clientX,
  //         y: e.clientY || e.touches[0].clientY,
  //         id,
  //         user,
  //       });
  //     } else if (currentShape === "circle") {
  //       drawCircle(context, [initialX, initialY], [mouseX, mouseY]);
  //       socket.emit("drawCircle", {
  //         initialX,
  //         initialY,
  //         mouseX,
  //         mouseY,
  //         id,
  //         user,
  //       });
  //     } else if (currentShape === "rectangle") {
  //       const width = mouseX - initialX;
  //       const height = mouseY - initialY;
  //       drawRect(context, initialX, initialY, width, height, true);
  //       socket.emit("drawRect", {
  //         initialX,
  //         initialY,
  //         width,
  //         height,
  //         id,
  //         user,
  //       });
  //     }
  //   };

  //   const handleMouseUp = (e: any) => {
  //     shouldDraw.current = false;
  //     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  //     addDrawHistory(imageData);
  //     setHistoryPointer(drawHistory.length - 1);
  //     // console.log(historyPointer);
  //   };

  //   canvas.addEventListener("mousedown", handleMouseDown);
  //   canvas.addEventListener("mousemove", handleMouseMove);
  //   canvas.addEventListener("mouseup", handleMouseUp);

  //   socket.on("beginPath", (data) => {
  //     if (data.user.id !== user.id) {
  //       console.log("hey");
  //       beginPath(context, data.x, data.y);
  //     }
  //   });

  //   socket.on("drawLine", (data) => {
  //     if (data.user.id !== user.id) {
  //       console.log("hey");
  //       drawLine(context, data.x, data.y);
  //     }
  //   });
  //   socket.on("drawRect", (data) => {
  //     if (data.user.id !== user.id) {
  //       console.log("hey");
  //       drawRect(
  //         context,
  //         data.initialX,
  //         data.initialY,
  //         data.width,
  //         data.height,
  //         true
  //       );
  //     }
  //   });
  //   socket.on("drawCircle", (data) => {
  //     // console.log(data);
  //     drawCircle(
  //       context,
  //       [data.initialX, data.initialY],
  //       [data.mouseX, data.mouseY]
  //     );
  //   });

  //   return () => {
  //     canvas.removeEventListener("mousedown", handleMouseDown);
  //     canvas.removeEventListener("mousemove", handleMouseMove);
  //     canvas.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [socket, id]);

  useEffect(() => {
    setDragging(false);
  }, []);

  // SETUP
  // useEffect(() => {
  //   const undoBtn = undoRef.current;
  //   const redoBtn = redoRef.current;

  //   undoBtn?.addEventListener('click', handleUndo);
  //   redoBtn?.addEventListener('click', handleRedo);

  //   return () => {
  //     undoBtn?.removeEventListener('click', handleUndo);
  //     redoBtn?.removeEventListener('click', handleRedo);
  //   };
  // }, [canvasRef, dragging, handleRedo, handleUndo, redoRef, undoRef]);

  // useEffect(() => {
  //   if (ctx) socket.emit('joined_room');
  // }, [ctx]);

  return (
    <>
      <motion.canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`absolute top-0 z-10 ${dragging && "cursor-move"}`}
        // style={{ x, y }}
        // DRAG
        drag={dragging}
        dragConstraints={{
          left: -width,
          right: 0,
          top: -height,
          bottom: 0,
        }}
        // dragControls={dragControls}
        dragElastic={0}
        dragControls={dragControls}
        dragTransition={{ power: 0, timeConstant: 0 }}
        // HANDLERS
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          if (e.button === 2) {
            setDragging(true);
            dragControls.start(e);
          } else handleStartDrawing(e.clientX, e.clientY);
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
      ></motion.canvas>
      <button
        className={`absolute bottom-14 right-5 z-10 rounded-xl md:bottom-5 ${
          dragging ? "bg-green-500" : "bg-zinc-300 text-black"
        } p-3 text-lg text-white`}
        onClick={() => setDragging((prev) => !prev)}
      >
        <BsArrowsMove />
      </button>
    </>
  );
};

export default Board;
