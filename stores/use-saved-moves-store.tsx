import { Move } from "@/types";
import { create } from "zustand";

type SavedMovesState = {
  savedMoves: Move[];
};

type SavedMovesActions = {
  addSavedMove: (move: Move) => void;
  removeSavedMove: () => Move | undefined;
  clearSavedMoves: () => void;
};

export const useSavedMovesStore = create<SavedMovesState & SavedMovesActions>(
  (set) => ({
    savedMoves: [],

    addSavedMove: (move) => {
      if (move.options.mode === "select") return;
      set((state) => ({
        savedMoves: [move, ...state.savedMoves],
      }));
    },

    removeSavedMove: () => {
      let move: Move | undefined;
      set((state) => {
        const [firstMove, ...rest] = state.savedMoves;
        move = firstMove;
        return { savedMoves: rest };
      });
      return move;
    },

    clearSavedMoves: () => {
      set(() => ({
        savedMoves: [],
      }));
    },
  })
);
