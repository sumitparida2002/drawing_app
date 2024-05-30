import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/queries";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await db.room.create({
      data: {
        userId: user.id,
        name,

        members: {
          create: [{ userId: user.id }],
        },
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
