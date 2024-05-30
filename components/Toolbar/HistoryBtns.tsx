import { useRoomStore } from "@/lib/hooks/use-room-store";
import { useRoom } from "@/providers/room-provider";
import { FaRedo, FaUndo } from "react-icons/fa";

const HistoryBtns = () => {
  const { canvasRef } = useRoom();
  const { Room, setHistoryPointer } = useRoomStore();
  const { drawHistory, historyPointer } = Room;
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  return (
    <>
      <div className="flex gap-4">
        <button
          className="btn-icon text-xl"
          onClick={() => {
            if (historyPointer < drawHistory.length - 1) {
              setHistoryPointer(historyPointer + 1);
              const imageData = drawHistory[historyPointer];
              context.putImageData(imageData, 0, 0);
            }
          }}
        >
          <FaRedo />
        </button>
        <button
          className="btn-icon text-xl"
          onClick={() => {
            if (historyPointer > 0) {
              setHistoryPointer(historyPointer - 1);

              const imageData = drawHistory[historyPointer];
              context.putImageData(imageData, 0, 0);
            }
          }}
        >
          <FaUndo />
        </button>
      </div>
    </>
  );
};

export default HistoryBtns;
