import Toolbar from "@/components/Toolbar/Toolbar";
import Board from "@/components/board";
import { useRoomStore } from "@/lib/hooks/use-room-store";
import UserList from "@/components/user-list";
// import { useRoom } from "@/lib/hooks/use-user-store";
import { roomDetails } from "@/lib/queries";
import RoomContextProvider from "@/providers/room-provider";
import { useSocket } from "@/providers/socket-provider";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import React from "react";
import { MoveImage } from "@/components/move-image";
import MousePosition from "@/components/mouse-position";
import { ChatInput } from "@/components/Chat/chat-input";
import { ChatMessages } from "@/components/Chat/chat-messages";
import { ChatHeader } from "@/components/Chat/chat-header";
import SelectionBtns from "@/components/Toolbar/SelectionBtns";

interface RoomIdPageParams {
  params: {
    roomId: string;
  };
}

async function RoomIdPage({ params }: RoomIdPageParams) {
  const room = await roomDetails(params.roomId);
  const user = await currentUser();

  if (!user) {
    console.log(user);
    return;
  }

  if (!room) {
    return redirect("/");
  }

  return (
    <RoomContextProvider room={room}>
      <div>
        <UserList />
        <MoveImage />
        <Board />
        <MousePosition />
        <Toolbar />
        <SelectionBtns />
      </div>
    </RoomContextProvider>
  );
}

export default RoomIdPage;
