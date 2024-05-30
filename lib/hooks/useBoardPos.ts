import { useRoom } from "@/providers/room-provider";
import { useContext } from "react";

export const useBoardPosition = () => {
  const { x, y } = useRoom();

  return { x, y };
};
