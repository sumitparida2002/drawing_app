import { useEffect, useMemo } from "react";

import { rgbaToString } from "@/lib/helpers/boardHelpers";

// import { useSetSelection } from "@/common/recoil/options";

import { useSocket } from "@/providers/socket-provider";
import { Move } from "@/types";
import { useRoomStore } from "./use-room-store";
import { useSavedMovesStore } from "./saved-moves-store";
import { useRoom } from "@/providers/room-provider";
import { useSelection } from "./use-selection";
import { useCtx } from "./useCtx";

let prevMovesLength = 0;

export const useMovesHandlers = (clearOnYourMove: () => void) => {
  const { socket } = useSocket();
  const { canvasRef, minimapRef, bgRef } = useRoom();

  const { addSavedMove, removeSavedMove } = useSavedMovesStore();
  const { removeMyMove, addMyMove, usersMoves, movesWithoutUser, myMoves } =
    useRoomStore();

  const canvas = canvasRef.current;
  const ctx = useCtx();
  //   const bg = useBackground();
  //   const { clearSelection } = useSelection();

  const sortedMoves = useMemo(() => {
    const moves = [...movesWithoutUser, ...myMoves];

    usersMoves.forEach((userMoves) => moves.push(...userMoves));

    moves.sort((a, b) => a.timestamp - b.timestamp);

    return moves;
  }, []);

  const copyCanvasToSmall = () => {
    if (canvasRef.current && minimapRef.current && bgRef.current) {
      const smallCtx = minimapRef.current.getContext("2d");
      if (smallCtx) {
        smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
        smallCtx.drawImage(
          bgRef.current,
          0,
          0,
          smallCtx.canvas.width,
          smallCtx.canvas.height
        );
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          smallCtx.canvas.width,
          smallCtx.canvas.height
        );
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => copyCanvasToSmall(), []);

  const drawMove = (move: Move, image?: HTMLImageElement) => {
    const { path } = move;

    if (!ctx || !path.length) return;

    const moveOptions = move.options;

    if (moveOptions.mode === "select") return;

    ctx.lineWidth = moveOptions.lineWidth;
    ctx.strokeStyle = rgbaToString(moveOptions.lineColor);
    ctx.fillStyle = rgbaToString(moveOptions.fillColor);
    if (moveOptions.mode === "eraser")
      ctx.globalCompositeOperation = "destination-out";
    else ctx.globalCompositeOperation = "source-over";

    if (moveOptions.shape === "image" && image)
      ctx.drawImage(image, path[0][0], path[0][1]);

    switch (moveOptions.shape) {
      case "line": {
        ctx.beginPath();
        path.forEach(([x, y]) => {
          ctx.lineTo(x, y);
        });

        ctx.stroke();
        ctx.closePath();
        break;
      }

      case "circle": {
        const { cX, cY, radiusX, radiusY } = move.circle;

        ctx.beginPath();
        ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        break;
      }

      case "rectangle": {
        const { width, height } = move.rect;

        ctx.beginPath();

        ctx.rect(path[0][0], path[0][1], width, height);
        ctx.stroke();
        ctx.fill();

        ctx.closePath();
        break;
      }

      default:
        break;
    }

    copyCanvasToSmall();
  };

  const drawAllMoves = async () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const images = await Promise.all(
      sortedMoves
        .filter((move) => move.options.shape === "image")
        .map((move) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = move.img.base64;
            img.id = move.id;
            img.addEventListener("load", () => resolve(img));
          });
        })
    );

    sortedMoves.forEach((move) => {
      if (move.options.shape === "image") {
        const img = images.find((image) => image.id === move.id);
        if (img) drawMove(move, img);
      } else drawMove(move);
    });

    copyCanvasToSmall();
  };

  useSelection(drawAllMoves);

  useEffect(() => {
    if (!socket) return;
    socket.on("your_move", (move) => {
      clearOnYourMove();
      addMyMove(move);
      //   setTimeout(clearSelection, 100);
    });

    return () => {
      socket.off("your_move");
    };
  }, [clearOnYourMove, addMyMove, socket]);

  useEffect(() => {
    if (prevMovesLength >= sortedMoves.length || !prevMovesLength) {
      drawAllMoves();
    } else {
      const lastMove = sortedMoves[sortedMoves.length - 1];

      if (lastMove.options.shape === "image") {
        const img = new Image();
        img.src = lastMove.img.base64;
        img.addEventListener("load", () => drawMove(lastMove, img));
      } else drawMove(lastMove);
    }

    return () => {
      prevMovesLength = sortedMoves.length;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedMoves]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUndo = () => {
    if (ctx) {
      const move = removeMyMove();

      if (move?.options.mode === "select") console.log("hey");
      else if (move) {
        addSavedMove(move);
        socket.emit("undo");
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRedo = () => {
    if (ctx) {
      const move = removeSavedMove();

      if (move) {
        socket.emit("draw", move);
      }
    }
  };

  useEffect(() => {
    const handleUndoRedoKeyboard = (e: KeyboardEvent) => {
      if (e.key === "z" && e.ctrlKey) {
        handleUndo();
      } else if (e.key === "y" && e.ctrlKey) {
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleUndoRedoKeyboard);

    return () => {
      document.removeEventListener("keydown", handleUndoRedoKeyboard);
    };
  }, [handleUndo, handleRedo]);

  return { handleUndo, handleRedo };
};
