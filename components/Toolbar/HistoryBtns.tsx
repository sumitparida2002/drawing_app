"use client";

import { useRoom } from "@/providers/room-provider";
import { useSocket } from "@/providers/socket-provider";
import { useRoomStore } from "@/stores/use-room-store";
import { useSavedMovesStore } from "@/stores/use-saved-moves-store";
import { useEffect } from "react";
import { FaRedo, FaUndo } from "react-icons/fa";

const HistoryBtns = () => {
  const { myMoves } = useRoomStore();

  const { redoRef, undoRef } = useRoom();
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  const { savedMoves } = useSavedMovesStore();

  return (
    <>
      <div className="flex gap-4">
        <button
          className="btn-icon text-xl"
          ref={redoRef}
          disabled={!savedMoves.length}
        >
          <FaRedo />
        </button>
        <button
          className="btn-icon text-xl"
          ref={undoRef}
          disabled={!myMoves.length}
        >
          <FaUndo />
        </button>
      </div>
    </>
  );
};

export default HistoryBtns;
