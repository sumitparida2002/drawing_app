import { useRoomStore } from "@/lib/hooks/use-room-store";

import { useSocket } from "@/providers/socket-provider";
import UserMouse from "./user-mouse";

const MousesRenderer = () => {
  const { socket } = useSocket();
  const { Room } = useRoomStore();
  const { users } = Room;

  return (
    <>
      {users.map((user) => {
        if (user.id === socket.id) return null;
        return <UserMouse userId={user.id} key={user.id} />;
      })}
    </>
  );
};

export default MousesRenderer;
