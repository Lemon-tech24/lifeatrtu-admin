import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, reason, email } = await request.json();
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const banUser = await prisma.blacklist.create({
        data: {
          reason: reason,
          userId: userId,
          email: email,
        },
      });

      if (banUser) {
        return NextResponse.json({ ok: true, msg: "User Ban Successfully" });
      } else return NextResponse.json({ ok: false, msg: "Failed to Ban User" });
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
