import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { BsBorderWidth } from "react-icons/bs";
import { useClickAway } from "react-use";

// import { useOptions } from '@/common/recoil/options';

import { EntryAnimation } from "./animations/Entry.animations";
import { useToolboxStore } from "@/lib/hooks/use-toolbox-store";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

const LineWidthPicker = () => {
  const { changeLineWidth, lineWidth } = useToolboxStore();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="btn-icon text-xl">
          <BsBorderWidth />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        {/* <input
            type="range"
            min={1}
            max={20}
            value={`${size}`}
            onChange={(e) => changeLineWidth(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          /> */}
        <Slider
          min={1}
          max={20}
          step={1}
          defaultValue={[lineWidth]}
          onValueChange={(e) => {
            changeLineWidth(e[0]);
          }}
        />
      </PopoverContent>
    </Popover>
    // <div className="relative flex items-center" ref={ref}>
    //
    //     <BsBorderWidth />
    //   </button>
    //   <AnimatePresence>
    //     {opened && (
    //       <motion.div
    //         className="absolute top-[6px] left-14 w-36"
    //         variants={EntryAnimation}
    //         initial="from"
    //         animate="to"
    //         exit="from"
    //       >
    //         <input
    //           type="range"
    //           min={1}
    //           max={20}
    //           value={`${size}`}
    //           onChange={(e) => changeLineWidth(parseInt(e.target.value, 10))}
    //           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    //         />
    //       </motion.div>
    //     )}
    //   </AnimatePresence>
    // </div>
  );
};

export default LineWidthPicker;
