import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/queries";

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMember = {
      userId: user.id,
    };

    const room = await db.room.findUnique({
      where: {
        id: params.roomId,
      },
      include: {
        members: true,
      },
    });

    if (room.members.some((member) => member.userId === newMember.userId)) {
      return NextResponse.json(room);
    }

    const newRoom = await db.room.update({
      where: {
        id: params.roomId,
      },
      data: {
        members: {
          create: [newMember],
        },
      },
    });

    return NextResponse.json(newRoom);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
