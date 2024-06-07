"use client";

import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ActionTooltip } from "./action-tooltip";
import { useRoomStore } from "@/stores/use-room-store";

const UserList = () => {
  const { users } = useRoomStore();

  if (!users) return;

  useEffect(() => {
    if (!users) return;
    console.log(users);
  }, [users]);

  return (
    <div className="pointer-events-none absolute top-4 z-30 flex p-5 gap-2">
      {users &&
        Array.from(users.entries()).map(([id, name]) => (
          <h1 key={id}>{name.name}</h1>
          // <Avatar className="gap-2" key={id}>
          //   <AvatarImage src={"blee"} />
          //   <AvatarFallback> {name}</AvatarFallback>
          // </Avatar>
        ))}
    </div>
  );
};

export default UserList;
