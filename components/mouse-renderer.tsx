"use client";
import UserMouse from "./user-mouse";
import { useSocket } from "@/providers/socket-provider";
import { useRoomStore } from "@/stores/use-room-store";

const MousesRenderer = () => {
  const { users } = useRoomStore();
  const { socket } = useSocket();

  return (
    <>
      {Array.from(users.keys()).map((userId) => {
        if (userId === socket.id) return null;
        return <UserMouse userId={userId} key={userId} />;
      })}
    </>
  );
};

export default MousesRenderer;
