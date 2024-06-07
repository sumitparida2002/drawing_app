import { useRef, useState } from "react";

import { BsBorderWidth } from "react-icons/bs";
import { useClickAway } from "react-use";

import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Slider } from "../ui/slider";
import { useToolboxStore } from "@/stores/use-toolbox-store";

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
  );
};

export default LineWidthPicker;
