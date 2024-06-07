"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { HiOutlineDownload } from "react-icons/hi";
import { ImExit } from "react-icons/im";

import { useRouter } from "next/navigation";

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
import { useViewportSize } from "@/hooks/use-viewport-size";

const ToolBar = () => {
  const { width } = useViewportSize();

  const router = useRouter();
  const { canvasRef } = useRoom();
  const canvas = canvasRef.current;

  const handleExit = () => router.push("/");

  return (
    <>
      <div className="w-full flex  justify-center">
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
