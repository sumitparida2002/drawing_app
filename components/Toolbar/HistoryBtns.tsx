import { useSavedMovesStore } from "@/lib/hooks/saved-moves-store";
import { useRoomStore } from "@/lib/hooks/use-room-store";
import { useRoom } from "@/providers/room-provider";
import { FaRedo, FaUndo } from "react-icons/fa";

const HistoryBtns = () => {
  const {} = useRoom();
  const { myMoves } = useRoomStore();

  const { redoRef, undoRef, canvasRef } = useRoom();

  const { savedMoves } = useSavedMovesStore();

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  return (
    <>
      <div className="flex gap-4">
        <button
          className="btn-icon text-xl"
          // onClick={() => {
          //   if (historyPointer < drawHistory.length - 1) {
          //     setHistoryPointer(historyPointer + 1);
          //     const imageData = drawHistory[historyPointer];
          //     context.putImageData(imageData, 0, 0);
          //   }
          // }}
          ref={redoRef}
          disabled={!savedMoves.length}
        >
          <FaRedo />
        </button>
        <button
          className="btn-icon text-xl"
          // onClick={() => {
          //   if (historyPointer > 0) {
          //     setHistoryPointer(historyPointer - 1);

          //     const imageData = drawHistory[historyPointer];
          //     context.putImageData(imageData, 0, 0);
          //   }
          // }}
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
