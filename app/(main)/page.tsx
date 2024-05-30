import { createUser } from "@/lib/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateRoom } from "./_components/create-room";
import { JoinRoom } from "./_components/join-room";

export default function Home() {
  const user = createUser();

  return (
    <div className="flex flex-col items-center py-24">
      <h1 className="text-5xl font-extrabold leading-tight sm:text-extra">
        Collab
      </h1>
      <h3 className="text-xl sm:text-2xl">Real-time Whiteboard</h3>

      <div className="mt-2 ">
        <CreateRoom />
      </div>
      <div className="mt-2 ">
        <JoinRoom />
      </div>
    </div>
  );
}
