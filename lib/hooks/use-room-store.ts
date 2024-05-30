import { create } from "zustand";

type User = {
  id: string;
  username: string;
  img: string;
};

type State = {
  Room: {
    id: string;
    userId: string;
    name: string;
    users: User[];
    drawHistory: ImageData[];
    historyPointer: number;
  };
};

type Actions = {
  setRoom: (id: string, name: string, userId: string) => void;
  addUser: (id: string, name: string, img: string) => void;
  removeUser: (id: string) => void;
  addDrawHistory: (imageData: ImageData) => void;
  setHistoryPointer: (historyPointer: number) => void;
};

export const useRoomStore = create<State & Actions>((set) => ({
  Room: {
    id: "",
    userId: "",
    name: "",
    users: [],
    drawHistory: [],
    historyPointer: 0,
  },

  setRoom: (id, name, userId) =>
    set((state) => ({ Room: { ...state.Room, id, name, userId } })),

  addUser: (id, name, img) => {
    set((state) => ({
      Room: {
        ...state.Room,
        users: [...(state.Room.users || []), { id, username: name, img }],
      },
    }));
  },

  removeUser: (id) =>
    set((state) => ({
      Room: {
        ...state.Room,
        users: state.Room.users.filter((usr) => usr.id !== id),
      },
    })),

  addDrawHistory: (imageData: ImageData) => {
    set((state) => ({
      Room: {
        ...state.Room,
        drawHistory: [...state.Room.drawHistory, imageData],
      },
    }));
  },
  setHistoryPointer(historyPointer) {
    set((state) => ({
      Room: {
        ...state.Room,

        historyPointer,
      },
    }));
  },
}));
