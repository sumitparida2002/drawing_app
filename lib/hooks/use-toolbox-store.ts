import { RgbaColor } from "react-colorful";
import { create } from "zustand";

type ShapeType = "pencil" | "circle" | "rectangle";
type ModeType = "draw" | "eraser";

type State = {
  currentShape: ShapeType;
  mode: ModeType;
  PENCIL: {
    color: RgbaColor;
    size: number;
  };
  CIRCLE: {
    color: RgbaColor;
  };
  RECTANGLE: {
    color: RgbaColor;
  };
};

type Actions = {
  changeColor: (color: RgbaColor) => void;
  changeShape: (shape: ShapeType) => void;
  changeMode: (mode: ModeType) => void;
  changeLineWidth: (size: number) => void;
};

export const useToolboxStore = create<State & Actions>((set) => ({
  currentShape: "pencil",
  mode: "draw",
  PENCIL: {
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },

    size: 3,
  },
  CIRCLE: {
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
  },
  RECTANGLE: {
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
  },
  changeColor: (color: RgbaColor) => {
    set((state) => ({
      PENCIL: { ...state.PENCIL, color },
      CIRCLE: { ...state.CIRCLE, color },
      RECTANGLE: { ...state.RECTANGLE, color },
    }));
  },
  changeShape: (shape: ShapeType) => {
    set({ currentShape: shape });
  },
  changeMode: (mode: ModeType) => {
    set({ mode });
  },

  changeLineWidth: (size: number) => {
    set((state) => ({
      PENCIL: { ...state.PENCIL, size },
    }));
  },
}));
