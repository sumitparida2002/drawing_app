import { create, useStore } from "zustand";

import { Move } from "@/types";

import { User } from "@/types";

type State = {
  id: string;
  users: Map<string, User>;
  usersMoves: Map<string, Move[]>;
  movesWithoutUser: [];
  myMoves: Move[];
};

type Actions = {
  setRoomId: (id: string) => void;
  addUser: (id: string, name: string) => void;
  removeUser: (id: string) => void;
  addMoveToUser: (userId: string, move: Move) => void;
  addMyMove: (move: Move) => void;
  removeMyMove: () => Move | undefined; //May need to return popped move
  setRoom: (roomState: State) => void;
  removeLastMoveFromUser: (userId: string) => void;
};

export const useRoomStore = create<State & Actions>((set) => ({
  id: "",
  users: new Map(),
  usersMoves: new Map(),
  myMoves: [],
  movesWithoutUser: [],

  setRoom: (roomState) => set(() => ({ ...roomState })),

  setRoomId: (id) => set({ id }),

  addUser: (id, name) =>
    set((state) => ({
      users: state.users.set(id, { name, color: "blue" }),
    })),
  // removeUser: (id) =>
  //   set((state) => ({
  //     users: state.users.delete(id),
  //     usersMoves: state.usersMoves.delete(id),
  //   })),
  removeUser: (id) =>
    set((state) => {
      const users = new Map(state.users);
      users.delete(id);
      const usersMoves = new Map(state.usersMoves);
      usersMoves.delete(id);
      return {
        users,
        usersMoves,
      };
    }),
  // addMoveToUser: (userId, move) =>
  //   set((state) => ({
  //     usersMoves: state.usersMoves.update(userId, (moves = []) => [
  //       ...moves,
  //       move,
  //     ]),
  //   })),
  addMoveToUser: (userId, move) =>
    set((state) => {
      const usersMoves = new Map(state.usersMoves);
      const moves = usersMoves.get(userId) || [];
      moves.push(move);
      usersMoves.set(userId, moves);
      return {
        usersMoves,
      };
    }),
  addMyMove: (move) => set((state) => ({ myMoves: [...state.myMoves, move] })),
  removeMyMove: () => {
    let move;
    set((state) => {
      const myMoves = [...state.myMoves];
      move = myMoves.pop();
      return {
        ...state,
        myMoves,
      };
    });
    return move;
  },
  removeLastMoveFromUser: (userId) =>
    set((state) => {
      const usersMoves = new Map(state.usersMoves);
      const moves = usersMoves.get(userId);
      if (moves && moves.length > 0) {
        moves.pop();
        usersMoves.set(userId, moves);
      }
      return {
        usersMoves,
      };
    }),
}));
