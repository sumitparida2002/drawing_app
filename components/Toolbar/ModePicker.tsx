import { useToolboxStore } from "@/lib/hooks/use-toolbox-store";
import { useEffect } from "react";

import { AiOutlineSelect } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { FaEraser } from "react-icons/fa";

const ModePicker = () => {
  const { mode, changeMode, clearSelection } = useToolboxStore();

  useEffect(() => {
    clearSelection();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <>
      <button
        onClick={() => {
          changeMode("draw");
        }}
      >
        <BsPencilFill
          className={`btn-icon text-xl 
      ${mode === "draw" && "text-green-400/100"}`}
        />
      </button>

      <button
        onClick={() => {
          changeMode("eraser");
        }}
      >
        <FaEraser
          className={`btn-icon text-xl 
          ${mode === "eraser" && "text-green-400/100"}`}
        />
      </button>

      <button
        onClick={() => {
          changeMode("select");
        }}
      >
        <AiOutlineSelect
          className={`btn-icon text-xl 
          ${mode === "select" && "text-green-400/100"}`}
        />
      </button>
    </>
  );
};

export default ModePicker;
