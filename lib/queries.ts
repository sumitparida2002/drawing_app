import {
  auth,
  currentUser as clerkCurrentUser,
  getAuth,
} from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const SIGN_IN_URL = "https://ace-mallard-19.accounts.dev/sign-in";

export const createUser = async () => {
  const clerkUser = await clerkCurrentUser();

  if (!clerkUser) {
    redirect(SIGN_IN_URL);
  }

  const user = await db.user.findUnique({
    where: {
      userId: clerkUser.id,
    },
  });

  if (user) {
    return user;
  }

  const newUser = await db.user.create({
    data: {
      userId: clerkUser.id,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      imageUrl: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};

export const currentUser = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.user.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};

export const currentMember = async (id: string) => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.member.findUnique({
    where: {
      id,
    },
  });

  return profile;
};

export const roomDetails = async (roomId: string) => {
  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
  });

  return room;
};
