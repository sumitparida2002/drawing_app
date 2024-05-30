"use client";

// import { useEffect } from "react";

// import { motion, useMotionValue } from "framer-motion";
// import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

// import { DEFAULT_MOVE } from "@/constants/defaultMove";

// import { Move } from "@/types";
// import { getPos } from "@/lib/getPos";
// import { useImageStore } from "@/lib/hooks/use-image-store";
// import { getBoardPosition } from "@/lib/hooks/getBoardPosition";

// const MoveImage = () => {
//   const { x, y } = getBoardPosition();
//   const { moveImage, setMoveImage } = useImageStore();

//   const imageX = useMotionValue(moveImage.x || 50);
//   const imageY = useMotionValue(moveImage.y || 50);

//   useEffect(() => {
//     if (moveImage.x) imageX.set(moveImage.x);
//     else imageX.set(50);
//     if (moveImage.y) imageY.set(moveImage.y);
//     else imageY.set(50);
//   }, [imageX, imageY, moveImage.x, moveImage.y]);

//   const handlePlaceImage = () => {
//     const [finalX, finalY] = [
//       getPos(imageX.get(), useMotionValue(x)),
//       getPos(imageY.get(), useMotionValue(y)),
//     ];

//     const move: Move = {
//       ...DEFAULT_MOVE,
//       img: { base64: moveImage.base64 },
//       path: [[finalX, finalY]],
//       options: {
//         ...DEFAULT_MOVE.options,
//         selection: null,
//         shape: "image",
//       },
//     };

//     setMoveImage("");
//     imageX.set(50);
//     imageY.set(50);
//   };

//   if (!moveImage.base64) return null;

//   return (
//     <motion.div
//       drag
//       dragElastic={0}
//       dragTransition={{ power: 0.03, timeConstant: 50 }}
//       className="absolute top-0 z-20 cursor-grab"
//       style={{ x: imageX, y: imageY }}
//     >
//       <div className="absolute bottom-full mb-2 flex gap-3">
//         <button
//           className="rounded-full bg-gray-200 p-2"
//           onClick={handlePlaceImage}
//         >
//           <AiOutlineCheck />
//         </button>
//         <button
//           className="rounded-full bg-gray-200 p-2"
//           onClick={() => setMoveImage("")}
//         >
//           <AiOutlineClose />
//         </button>
//       </div>
//       <img
//         className="pointer-events-none"
//         alt="image to place"
//         src={moveImage.base64}
//       />
//     </motion.div>
//   );
// };

// export default MoveImage;

import React, { useEffect, useLayoutEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useImageStore } from "@/lib/hooks/use-image-store";
import { useRoom } from "@/providers/room-provider";
import { useSocket } from "@/providers/socket-provider";
import { useStore } from "zustand";
import { useRoomStore } from "@/lib/hooks/use-room-store";

export const MoveImage = () => {
  const { images, removeImage } = useImageStore();

  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);
  const { canvasRef } = useRoom();
  let context = null;
  const { socket } = useSocket();
  const { Room } = useRoomStore();
  const { id } = Room;

  const handleDrawImage = (image, x, y) => {
    context.drawImage(image, x, y);
    socket.emit("drawImage", {
      id,
      image: image.uri,
      x,
      y,
    });

    useEffect(() => {
      if (!canvasRef.current || !socket) return;
      const canvas = canvasRef.current;
      let context = canvas.getContext("2d");
    }, [images, context]);
  };

  useLayoutEffect(() => {
    if (!canvasRef.current || !socket) return;
    const canvas = canvasRef.current;
    let context = canvas.getContext("2d");

    socket.on("drawImage", (data) => {
      console.log("what");
      const { image, x, y } = data;
      const img = new Image();
      img.src = image;
      context.drawImage(img, x, y);
    });
  }, [images, socket, id]);

  return (
    <>
      {images.map((image, index) => (
        <motion.div
          key={index}
          drag
          dragElastic={0}
          dragTransition={{ power: 0.03, timeConstant: 50 }}
          className="absolute top-0 z-20 cursor-grab"
          // onKeyDown={(event) => {
          //   if (event.key === "Delete") {
          //     removeImage(image);
          //   }
          // }}
        >
          <img
            className="pointer-events-none"
            alt="image to place"
            src={image.uri}
            onClick={() => handleDrawImage(image, imageX, imageY)}
          />
        </motion.div>
      ))}
    </>
  );
};
