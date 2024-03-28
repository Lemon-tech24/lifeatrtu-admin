import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

let perma: boolean;
let IntPeriod: number;

export async function POST(request: NextRequest) {
  const { userId, reason, email, period, custom } = await request.json();

  const session = await getServerSession(authOptions);

  const startingTime = Math.floor(Date.now() / 1000);

  if (period === "permanent") {
    perma = true;
    IntPeriod = 29220; //80 years
  } else if (period !== "custom") {
    perma = false;
    IntPeriod = parseInt(period);
  }

  if (custom && period === "custom") {
    perma = false;
    IntPeriod = parseInt(custom);
  }

  try {
    if (session) {
      const existingBanRecord = await prisma.blacklist.findFirst({
        where: {
          userId: userId,
          email: email,
        },
      });

      if (existingBanRecord) {
        const updateUser = await prisma.blacklist.update({
          where: {
            id: existingBanRecord.id,
            userId: existingBanRecord.userId,
            email: existingBanRecord.email,
          },

          data: {
            reason: reason,
            periodTime: startingTime,
            permanent: perma,
            days: IntPeriod,
          },
        });

        if (updateUser) {
          return NextResponse.json({ ok: true, msg: "User Ban Sucessfully" });
        } else
          return NextResponse.json({ ok: false, msg: "Failed to Ban User" });
      } else {
        const banUser = await prisma.blacklist.create({
          data: {
            userId: userId,
            reason: reason,
            email: email,
            periodTime: startingTime,
            permanent: perma,
            days: IntPeriod,
          },
        });

        if (banUser) {
          return NextResponse.json({ ok: true, msg: "User Ban Successfully" });
        } else
          return NextResponse.json({ ok: false, msg: "Failed to Ban User" });
      }
    } else {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }
  } catch (err) {
    throw new Error("Error");
  }
}
