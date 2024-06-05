import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { RgbaColorPicker } from "react-colorful";
import { BsPaletteFill } from "react-icons/bs";
import { useClickAway } from "react-use";

import { EntryAnimation } from "./animations/Entry.animations";
import { useToolboxStore } from "@/lib/hooks/use-toolbox-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ColorPicker = () => {
  const { changeColor, lineColor } = useToolboxStore();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  // useClickAway(ref, () => setOpened(false));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="btn-icon text-xl"
          onClick={() => setOpened(!opened)}
          // disabled={options.mode === "select"}
        >
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
    // <div className="relative flex items-center" ref={ref}>

    //   <AnimatePresence>
    // {/* {opened && (

    // )} */}
    //   </AnimatePresence>
    // </div>
  );
};

export default ColorPicker;
