"use client";

import { useState } from "react";
import { useBoardPosition } from "./useBoardPos";
import { useRoomStore } from "./use-room-store";
import { useViewportSize } from "./useViewportSize";
import { useToolboxStore } from "./use-toolbox-store";
import { useRoom } from "@/providers/room-provider";
import {
  drawCircle,
  drawLine,
  drawRect,
  rgbaToString,
} from "../helpers/boardHelpers";
import { getPos } from "../getPos";
import { useSocket } from "@/providers/socket-provider";
import { Move } from "@/types";
import { DEFAULT_MOVE } from "@/constants/defaultMove";
import { useSavedMovesStore } from "./saved-moves-store";

let tempMoves: [number, number][] = [];
let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0 };
let tempImageData: ImageData | undefined;

export const useDraw = (blocked: boolean, id: string) => {
  const { socket } = useSocket();
  const boardPosition = useBoardPosition();
  const { clearSavedMoves } = useSavedMovesStore();
  const { addMyMove } = useRoomStore();

  const { canvasRef } = useRoom();
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  const vw = useViewportSize();

  const {
    shape,
    mode,
    lineWidth,
    lineColor,
    fillColor,
    selection,
    setSelection,
    clearSelection,
  } = useToolboxStore();

  const options = {
    lineColor,
    fillColor,
    lineWidth,
    mode,
    shape,
    selection,
  };

  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  const [drawing, setDrawing] = useState(false);

  const setupCtxOptions = () => {
    if (ctx) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = rgbaToString(lineColor);
      ctx.fillStyle = rgbaToString(fillColor);
      if (mode === "eraser") ctx.globalCompositeOperation = "destination-out";
      else ctx.globalCompositeOperation = "source-over";
    }
  };

  const drawAndSet = () => {
    if (!tempImageData)
      tempImageData = ctx?.getImageData(
        movedX.get() * -1,
        movedY.get() * -1,
        vw.width,
        vw.height
      );

    if (tempImageData)
      ctx?.putImageData(tempImageData, movedX.get() * -1, movedY.get() * -1);
  };

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked || blocked) return;

    const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

    setDrawing(true);
    setupCtxOptions();
    drawAndSet();

    if (shape === "line" && mode !== "select") {
      ctx.beginPath();
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }

    tempMoves.push([finalX, finalY]);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

    drawAndSet();

    if (mode === "select") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
      tempMoves.push([finalX, finalY]);

      setupCtxOptions();

      return;
    }

    switch (shape) {
      case "line":
        if (shift) tempMoves = tempMoves.slice(0, 1);

        drawLine(ctx, tempMoves[0], finalX, finalY, shift);

        tempMoves.push([finalX, finalY]);
        break;

      case "circle":
        tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY, shift);
        break;

      case "rectangle":
        tempSize = drawRect(ctx, tempMoves[0], finalX, finalY, shift);
        break;

      default:
        break;
    }
  };

  const clearOnYourMove = () => {
    drawAndSet();
    tempImageData = undefined;
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);

    ctx.closePath();

    let addMove = true;
    if (mode === "select" && tempMoves.length) {
      clearOnYourMove();
      let x = tempMoves[0][0];
      let y = tempMoves[0][1];
      let width = tempMoves[tempMoves.length - 1][0] - x;
      let height = tempMoves[tempMoves.length - 1][1] - y;

      if (width < 0) {
        width -= 4;
        x += 2;
      } else {
        width += 4;
        x -= 2;
      }
      if (height < 0) {
        height -= 4;
        y += 2;
      } else {
        height += 4;
        y -= 2;
      }

      if ((width < 4 || width > 4) && (height < 4 || height > 4))
        setSelection({ x, y, width, height });
      else {
        clearSelection();
        addMove = false;
      }
    }

    const move: Move = {
      ...DEFAULT_MOVE,
      rect: {
        ...tempSize,
      },
      circle: {
        ...tempCircle,
      },
      path: tempMoves,
      options,
    };

    tempMoves = [];
    tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
    tempSize = { width: 0, height: 0 };

    if (mode !== "select") {
      console.log("what");
      socket.emit("draw", { move, id });
      clearSavedMoves();
    } else if (addMove) addMyMove(move);
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    clearOnYourMove,
  };
};
