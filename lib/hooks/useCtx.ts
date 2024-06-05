import { useRoom } from "@/providers/room-provider";
import { useEffect, useState } from "react";

export const useCtx = () => {
  const { canvasRef } = useRoom();

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");

    if (newCtx) {
      newCtx.lineJoin = "round";
      newCtx.lineCap = "round";
      setCtx(newCtx);
    }
  }, [canvasRef]);

  return ctx;
};
