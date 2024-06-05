import { RgbaColor } from "react-colorful";
import { create } from "zustand";

type ShapeType = "line" | "circle" | "rectangle";
type ModeType = "draw" | "eraser" | "select";

// type State = {
//   currentShape: ShapeType;
//   mode: ModeType;
//   // lineColor:RgbaColor;
//   // fillColor:RgbaColor
//   PENCIL: {
//     color: RgbaColor;
//     size: number;
//   };
//   CIRCLE: {
//     color: RgbaColor;
//   };
//   RECTANGLE: {
//     color: RgbaColor;
//   };
//   selection: any;
// };

// type Actions = {
//   changeColor: (color: RgbaColor) => void;
//   changeShape: (shape: ShapeType) => void;
//   changeMode: (mode: ModeType) => void;
//   changeLineWidth: (size: number) => void;
//   setSelection: (rect: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }) => void;

//   clearSelection: () => void;
// };

// export const useToolboxStore = create<State & Actions>((set) => ({
//   currentShape: "pencil",
//   selection: null,
//   mode: "draw",
//   PENCIL: {
//     color: {
//       r: 0,
//       g: 0,
//       b: 0,
//       a: 1,
//     },

//     size: 3,
//   },
//   CIRCLE: {
//     color: {
//       r: 0,
//       g: 0,
//       b: 0,
//       a: 1,
//     },
//   },
//   RECTANGLE: {
//     color: {
//       r: 0,
//       g: 0,
//       b: 0,
//       a: 1,
//     },
//   },
//   changeColor: (color: RgbaColor) => {
//     set((state) => ({
//       PENCIL: { ...state.PENCIL, color },
//       CIRCLE: { ...state.CIRCLE, color },
//       RECTANGLE: { ...state.RECTANGLE, color },
//     }));
//   },
//   changeShape: (shape: ShapeType) => {
//     set({ currentShape: shape });
//   },
//   changeMode: (mode: ModeType) => {
//     set({ mode });
//   },

//   changeLineWidth: (size: number) => {
//     set((state) => ({
//       PENCIL: { ...state.PENCIL, size },
//     }));
//   },

//   setSelection: (rect: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }) => {
//     set({ selection: rect });
//   },

//   clearSelection() {
//     set({ selection: null });
//   },
// }));

type State = {
  lineColor: RgbaColor;
  fillColor: RgbaColor;
  lineWidth: number;
  mode: ModeType;
  shape: ShapeType;
  selection: any;
};

type Actions = {
  changeColor: (color: RgbaColor) => void;
  changeShape: (shape: ShapeType) => void;
  changeMode: (mode: ModeType) => void;
  changeLineWidth: (size: number) => void;
  setSelection: (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;

  clearSelection: () => void;
};

export const useToolboxStore = create<State & Actions>((set) => ({
  lineColor: {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  },
  fillColor: {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  },
  lineWidth: 5,
  mode: "draw",
  shape: "line",
  selection: null,
  changeColor: (color: RgbaColor) => {
    set({ lineColor: color, fillColor: color });
  },
  changeLineWidth: (size: number) => {
    set({ lineWidth: size });
  },
  changeMode: (mode: ModeType) => {
    set({ mode });
  },
  changeShape: (shape: ShapeType) => {
    set({ shape });
  },
  setSelection: (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    set({ selection: rect });
  },
  clearSelection: () => {
    set({ selection: null });
  },
}));
