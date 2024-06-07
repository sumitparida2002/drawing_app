import { useRef, useState } from "react";

import { BiRectangle } from "react-icons/bi";
import { BsCircle } from "react-icons/bs";
import { CgShapeZigzag } from "react-icons/cg";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToolboxStore } from "@/stores/use-toolbox-store";

const ShapeSelector = () => {
  const { shape, changeShape, mode } = useToolboxStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="btn-icon text-xl" disabled={mode === "select"}>
          {shape === "circle" && <BsCircle />}
          {shape === "rectangle" && <BiRectangle />}
          {shape === "line" && <CgShapeZigzag />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-fit bg-zinc-900 text-white gap-2">
        <button
          className="btn-icon text-2xl"
          onClick={() => changeShape("line")}
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
  );
};

export default ShapeSelector;
