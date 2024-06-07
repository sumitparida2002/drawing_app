import { create } from "zustand";

type ModeType = "dark" | "light";

type State = {
  mode: ModeType;
  lines: boolean;
};

type Actions = {
  setMode: (mode: ModeType) => void;
  setLines: (lines: boolean) => void;
};

export const useBackgroundStore = create<State & Actions>((set) => ({
  mode: "light",
  lines: true,
  setMode: (mode: ModeType) => set({ mode }),
  setLines: (lines: boolean) => set({ lines }),
}));

//Add Dynamic color at Layout
