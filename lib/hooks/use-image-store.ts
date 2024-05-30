import { create } from "zustand";

// type State = {
//   image: {
//     base64: string;
//     x?: number;
//     y?: number;
//   };
// };

// type Actions = {
//   setImage: (base64: string) => void;
// };

// export const useImageStore = create<State & Actions>((set) => ({
//   image: {
//     base64: "",
//     x: 0,
//     y: 0,
//   },
//   setImage: (base64: string) => {
//     set((state) => ({
//       image: { ...state.image, base64 },
//     }));
//   },
// }));

type Image = {
  uri: string;
  x?: number;
  y?: number;
};

type State = {
  images: Image[];
};

type Actions = {
  addImage: (uri: string, x: number, y: number) => void;
  removeImage: (image: Image) => void;
};

export const useImageStore = create<State & Actions>((set) => ({
  images: [],
  addImage: (uri, x, y) =>
    set((state) => ({ images: [...state.images, { uri, x, y }] })),

  removeImage: (image) =>
    set((state) => ({
      images: state.images.filter((img) => img.uri !== image.uri),
    })),
}));
