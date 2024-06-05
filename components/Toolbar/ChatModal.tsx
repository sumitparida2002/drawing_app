"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CgScreen } from "react-icons/cg";
import { Input } from "../ui/input";
import { ChatHeader } from "../Chat/chat-header";
import { ChatInput } from "../Chat/chat-input";
import { ChatMessages } from "../Chat/chat-messages";
import { useRoomStore } from "@/lib/hooks/use-room-store";

function ChatModal() {
  const { id, name, userId } = useRoomStore();

  const room = {
    id,
    name,
    userId,
  };
  const member = {
    id: "830d27bc-1d7d-4865-bb97-8cd4eff1f7d9",
    userId: "f56d5996-08d3-47a5-b003-214630f17c72",
    roomId: id,
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn-icon text-xl">
          <CgScreen />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[60%] h-[80%] flex flex-col justify-between">
        <DialogHeader>
          <ChatHeader name={room.name} type="room" />
        </DialogHeader>
        <ChatMessages
          member={member}
          name={room.name}
          chatId={room.id}
          type="room"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            roomId: room.id, //fix
          }}
          paramKey="roomId"
          paramValue={room.id}
        />
        <ChatInput
          name={room.name}
          type="room"
          apiUrl="/api/socket/messages"
          query={{
            roomId: room.id, //room
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ChatModal;
