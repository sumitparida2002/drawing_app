import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { RgbaColorPicker } from "react-colorful";
import { BsPaletteFill } from "react-icons/bs";
import { useClickAway } from "react-use";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToolboxStore } from "@/stores/use-toolbox-store";

const ColorPicker = () => {
  const { changeColor, lineColor, mode } = useToolboxStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="btn-icon text-xl" disabled={mode === "select"}>
          <BsPaletteFill />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit  border-0 ">
        <RgbaColorPicker
          color={lineColor}
          onChange={(e) => {
            changeColor(e);
          }}
          className="mb-5"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
