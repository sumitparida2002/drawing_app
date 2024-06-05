// import { create } from "zustand";

// type User = {
//   id: string;
//   username: string;
//   img: string;
// };

// type State = {
//   Room: {
//     id: string;
//     userId: string;
//     name: string;
//     users: User[];
//     usersMoves: Map<string, string>;
//     movesWithoutUser: [];
//     myMoves: [];
//     drawHistory: ImageData[];
//     historyPointer: number;
//   };
// };

// type Actions = {
//   setRoom: (id: string, name: string, userId: string) => void;
//   addUser: (id: string, name: string, img: string) => void;
//   removeUser: (id: string) => void;
//   addDrawHistory: (imageData: ImageData) => void;
//   setHistoryPointer: (historyPointer: number) => void;
// };

// export const useRoomStore = create<State & Actions>((set) => ({
//   Room: {
//     id: "",
//     userId: "",
//     name: "",
//     users: [],
//     usersMoves: new Map(),
//     myMoves: [],
//     movesWithoutUser: [],
//     drawHistory: [],
//     historyPointer: 0,
//   },

//   setRoom: (id, name, userId) =>
//     set((state) => ({ Room: { ...state.Room, id, name, userId } })),

//   addUser: (id, name, img) => {
//     set((state) => ({
//       Room: {
//         ...state.Room,
//         users: [...(state.Room.users || []), { id, username: name, img }],
//       },
//     }));
//   },

//   removeUser: (id) =>
//     set((state) => ({
//       Room: {
//         ...state.Room,
//         users: state.Room.users.filter((usr) => usr.id !== id),
//       },
//     })),

//   addDrawHistory: (imageData: ImageData) => {
//     set((state) => ({
//       Room: {
//         ...state.Room,
//         drawHistory: [...state.Room.drawHistory, imageData],
//       },
//     }));
//   },
//   setHistoryPointer(historyPointer) {
//     set((state) => ({
//       Room: {
//         ...state.Room,

//         historyPointer,
//       },
//     }));
//   },
// }));

import { Move } from "@/types";
import { create } from "zustand";

type User = {
  id: string;
  username: string;
  img: string;
  color?: string;
};

type RoomState = {
  id: string;
  userId: string;
  name: string;
  users: User[];
  usersMoves: Map<string, Move[]>;
  movesWithoutUser: Move[];
  myMoves: Move[];
  drawHistory: ImageData[];
  historyPointer: number;
};

type RoomActions = {
  setRoom: (id: string, name: string, userId: string) => void;
  addUser: (id: string, name: string, img: string) => void;
  removeUser: (id: string) => void;
  addMoveToUser: (userId: string, move: Move) => void;
  removeMoveFromUser: (userId: string) => void;
  addMyMove: (move: Move) => void;
  removeMyMove: () => Move | undefined;
  addDrawHistory: (imageData: ImageData) => void;
  setHistoryPointer: (historyPointer: number) => void;
};

export const useRoomStore = create<RoomState & RoomActions>((set) => ({
  id: "",
  userId: "",
  name: "",
  users: [],
  usersMoves: new Map(),
  movesWithoutUser: [],
  myMoves: [],
  drawHistory: [],
  historyPointer: 0,

  setRoom: (id, name, userId) =>
    set((state) => ({
      ...state,
      id,
      name,
      userId,
    })),

  addUser: (id, name, img) => {
    set((state) => ({
      ...state,
      users: [...state.users, { id, username: name, img }],
    }));
  },

  removeUser: (id) =>
    set((state) => ({
      ...state,
      users: state.users.filter((user) => user.id !== id),
    })),

  addMoveToUser: (userId, move) => {
    set((state) => {
      const usersMoves = new Map(state.usersMoves);
      const userMoves = usersMoves.get(userId) || [];
      usersMoves.set(userId, [...userMoves, move]);
      return {
        ...state,
        usersMoves,
      };
    });
  },

  removeMoveFromUser: (userId) => {
    set((state) => {
      const usersMoves = new Map(state.usersMoves);
      const userMoves = usersMoves.get(userId) || [];
      userMoves.pop();
      usersMoves.set(userId, userMoves);
      return {
        ...state,
        usersMoves,
      };
    });
  },

  addMyMove: (move) => {
    set((state) => {
      const myMoves = [...state.myMoves];
      console.log(myMoves);
      if (myMoves[myMoves.length - 1]?.options.mode === "select") {
        myMoves[myMoves.length - 1] = move;
      } else {
        myMoves.push(move);
      }
      return {
        ...state,
        myMoves,
      };
    });
  },

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

  addDrawHistory: (imageData) => {
    set((state) => ({
      ...state,
      drawHistory: [...state.drawHistory, imageData],
    }));
  },

  setHistoryPointer: (historyPointer) => {
    set((state) => ({
      ...state,
      historyPointer,
    }));
  },
}));
