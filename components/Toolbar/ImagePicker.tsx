"use client";

import { useImageStore } from "@/lib/hooks/use-image-store";
import { optimizeImage } from "@/lib/optimizeImage";
import { useEffect } from "react";

import { BsFillImageFill } from "react-icons/bs";

const ImagePicker = () => {
  const { images, addImage } = useImageStore();
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of items) {
          if (item.type.includes("image")) {
            const file = item.getAsFile();
            // optimizeImage(file, (uri) => setImage(uri));
            optimizeImage(file, (uri) => {
              const x = Math.random() * 500; // generate random x coordinate
              const y = Math.random() * 500; // generate random y coordinate
              addImage(uri, x, y);
            });
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [images]);

  const handleImageInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", () => {
      if (fileInput && fileInput.files) {
        const file = fileInput.files[0];

        // optimizeImage(file, (uri) => addImage(uri));
        optimizeImage(file, (uri) => {
          const x = Math.random() * 500; // generate random x coordinate
          const y = Math.random() * 500; // generate random y coordinate
          addImage(uri, x, y);
        });
      }
    });
  };

  return (
    <button className="btn-icon text-xl" onClick={handleImageInput}>
      <BsFillImageFill />
    </button>
  );
};

export default ImagePicker;
