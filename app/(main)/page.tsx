"use client";

import { FormEvent, useEffect, useState } from "react";

import { useSocket } from "@/providers/socket-provider";
import { useRoomStore } from "@/stores/use-room-store";
import { useRouter } from "next/navigation";

const Home = () => {
  const { socket } = useSocket();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const { setRoomId: setAtomRoomId } = useRoomStore();

  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        console.log("bothce");
      }
    };

    socket.on("joined", handleJoinedRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
    };
  }, [roomId, router, setAtomRoomId, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId, socket]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roomId) {
      console.log("brothther wha", username);
      socket.emit("join_room", roomId, username);
    }
  };

  return (
    <div className="flex flex-col items-center py-24">
      <h1 className="text-5xl font-extrabold leading-tight sm:text-extra">
        Collabio
      </h1>
      <h3 className="text-xl sm:text-2xl">Real-time whiteboard</h3>

      <div className="mt-10 flex flex-col gap-2">
        <label className="self-start font-bold leading-tight">
          Enter your name
        </label>
        <input
          className="input"
          id="room-id"
          placeholder="Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value.slice(0, 15))}
        />
      </div>

      <div className="my-8 h-px w-96 bg-zinc-200" />

      <form
        className="flex flex-col items-center gap-3"
        onSubmit={handleJoinRoom}
      >
        <label htmlFor="room-id" className="self-start font-bold leading-tight">
          Enter room id
        </label>
        <input
          className="input"
          id="room-id"
          placeholder="Room id..."
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn" type="submit">
          Join
        </button>
      </form>

      <div className="my-8 flex w-96 items-center gap-2">
        <div className="h-px w-full bg-zinc-200" />
        <p className="text-zinc-400">or</p>
        <div className="h-px w-full bg-zinc-200" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h5 className="self-start font-bold leading-tight">Create new room</h5>

        <button className="btn" onClick={handleCreateRoom}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Home;
