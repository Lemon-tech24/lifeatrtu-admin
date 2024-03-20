import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, reason, email, period } = await request.json();
  const session = await getServerSession(authOptions);

  const startingTime = new Date().getTime();
  let perma: boolean;
  let periodMilliseconds = 0;

  switch (period) {
    case "1day":
      periodMilliseconds = 1 * 24 * 60 * 60 * 1000;
      break;
    case "3days":
      periodMilliseconds = 3 * 24 * 60 * 60 * 1000;
      break;
    case "7days":
      periodMilliseconds = 7 * 24 * 60 * 60 * 1000;
      break;
    case "30days":
      periodMilliseconds = 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      periodMilliseconds = 0;
      break;
  }

  if (periodMilliseconds === 0) {
    perma = true;
  } else {
    perma = false;
  }

  try {
    if (session) {
      const banUser = await prisma.blacklist.create({
        data: {
          userId: userId,
          reason: reason,
          email: email,
          periodTime: periodMilliseconds,
          permanent: perma,
        },
      });

      if (banUser) {
        return NextResponse.json({ ok: true, msg: "User Ban Successfully" });
      } else return NextResponse.json({ ok: false, msg: "Failed to Ban User" });
    } else {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }
  } catch (err) {
    throw new Error("Error");
  }
}
