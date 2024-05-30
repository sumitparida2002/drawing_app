import { useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { BiRectangle } from "react-icons/bi";
import { BsCircle } from "react-icons/bs";
import { CgShapeZigzag } from "react-icons/cg";
import { useClickAway } from "react-use";

import { EntryAnimation } from "./animations/Entry.animations";
import { useToolboxStore } from "@/lib/hooks/use-toolbox-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ShapeSelector = () => {
  //   const [options, setOptions] = useOptions();
  const { currentShape, changeShape } = useToolboxStore();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="btn-icon text-xl"
          // disabled={options.mode === 'select'}
          onClick={() => setOpened((prev) => !prev)}
        >
          {currentShape === "circle" && <BsCircle />}
          {currentShape === "rectangle" && <BiRectangle />}
          {currentShape === "pencil" && <CgShapeZigzag />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-fit bg-zinc-900 text-white gap-2">
        <button
          className="btn-icon text-2xl"
          onClick={() => changeShape("pencil")}
        >
          <CgShapeZigzag />
        </button>

        <button
          className="btn-icon text-2xl"
          onClick={() => changeShape("rectangle")}
        >
          <BiRectangle />
        </button>

        <button
          className="btn-icon text-2xl"
          onClick={() => changeShape("circle")}
        >
          <BsCircle />
        </button>
      </PopoverContent>
    </Popover>
    // <div className="relative flex items-center" ref={ref}>

    //   <AnimatePresence>
    //     {opened && (
    //       <motion.div
    //         className="absolute left-14 z-10 flex gap-1 rounded-lg border bg-zinc-900 p-2 md:border-0"
    //         variants={EntryAnimation}
    //         initial="from"
    //         animate="to"
    //         exit="from"
    //       >
    //         <button
    //           className="btn-icon text-2xl"
    //           onClick={() => changeShape("pencil")}
    //         >
    //           <CgShapeZigzag />
    //         </button>

    //         <button
    //           className="btn-icon text-2xl"
    //           onClick={() => changeShape("rectangle")}
    //         >
    //           <BiRectangle />
    //         </button>

    //         <button
    //           className="btn-icon text-2xl"
    //           onClick={() => changeShape("circle")}
    //         >
    //           <BsCircle />
    //         </button>
    //       </motion.div>
    //     )}
    //   </AnimatePresence>
    // </div>
  );
};

export default ShapeSelector;
