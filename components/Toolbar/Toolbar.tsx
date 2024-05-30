"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { FiChevronRight } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { ImExit } from "react-icons/im";

import { useRouter } from "next/navigation";
import { useViewportSize } from "@/lib/hooks/useViewportSize";

// import BackgroundPicker from "./BackgroundPicker";
import ColorPicker from "./ColorPicker";
import HistoryBtns from "./HistoryBtns";
import ImagePicker from "./ImagePicker";
import LineWidthPicker from "./LineWidthPicker";
import ModePicker from "./ModePicker";
import ShapeSelector from "./ShapeSelector";
import { ShareModal } from "./ShareModal";
import { handleDownload } from "@/lib/helpers/boardHelpers";
import { useRoom } from "@/providers/room-provider";
import ChatModal from "./ChatModal";

const ToolBar = () => {
  const { width } = useViewportSize();

  const [opened, setOpened] = useState(false);

  const router = useRouter();
  const { canvasRef } = useRoom();
  const canvas = canvasRef.current;

  useEffect(() => {
    if (width >= 1024) setOpened(true);
    else setOpened(false);
  }, [width]);

  const handleExit = () => router.push("/");

  //   const handleShare = () => openModal(<ShareModal />);

  return (
    <>
      <div className="w-full flex  justify-center">
        {/* <motion.button
        className="btn-icon absolute top-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-black text-2xl transition-none lg:hidden"
        animate={{ rotate: opened ? 0 : 180 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpened(!opened)}
      >
        <FiChevronRight />
      </motion.button> */}
        <motion.div className="absolute  mx-auto top-4 z-50 items-center justify-center gap-10 rounded-lg bg-zinc-900 p-5 text-white flex px-8">
          <div>
            <HistoryBtns />
          </div>

          <div className="flex gap-4">
            <ShapeSelector />
            <ColorPicker />
            <LineWidthPicker />
            <ModePicker />
            <ImagePicker />
          </div>

          <div className="flex gap-4">
            <ChatModal />
            <ShareModal />
            <button
              onClick={() => handleDownload(canvas)}
              className="btn-icon text-xl"
            >
              <HiOutlineDownload />
            </button>
            <button className="btn-icon text-xl" onClick={handleExit}>
              <ImExit />
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ToolBar;
