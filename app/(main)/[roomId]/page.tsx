"use client";
import { ChatHeader } from "@/components/Chat/chat-header";
import ToolBar from "@/components/Toolbar/Toolbar";
import Board from "@/components/board";
import UserList from "@/components/user-list";
import RoomContextProvider from "@/providers/room-provider";
import { useRoomStore } from "@/stores/use-room-store";
import { redirect } from "next/dist/server/api-utils";
import { notFound } from "next/navigation";

const Room = () => {
  const room = useRoomStore();

  if (!room.id) notFound();

  console.log(room.id, room.users);

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full ">
        <UserList />
        <ToolBar />
        <Board />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
