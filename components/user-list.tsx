"use client";
import { useRoomStore } from "@/lib/hooks/use-room-store";
// import { useRoom } from "@/lib/hooks/use-user-store";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ActionTooltip } from "./action-tooltip";

const UserList = () => {
  const { Room } = useRoomStore();
  const { users } = Room;

  if (!users) return;

  useEffect(() => {
    if (!users) return;
    console.log(users);
  }, [users]);

  return (
    <div className="pointer-events-none absolute top-4 z-30 flex p-5 gap-2">
      {users.map((user, index) => {
        return (
          <Avatar className="gap-2">
            <AvatarImage src={user.img} />
            <AvatarFallback> {user.username}</AvatarFallback>
          </Avatar>
        );
      })}
    </div>
  );
};

export default UserList;
