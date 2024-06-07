import SelectionBtns from "./Toolbar/SelectionBtns";
import Canvas from "./canvas";
import MousePosition from "./mouse-position";
import MousesRenderer from "./mouse-renderer";
import MoveImage from "./move-image";

const Board = () => (
  <>
    <Canvas />
    <MousePosition />
    <MousesRenderer />
    <MoveImage />
    <SelectionBtns />
  </>
);

export default Board;
