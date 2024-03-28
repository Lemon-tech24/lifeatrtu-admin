import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    if (session) {
      const banUsers = await prisma.blacklist.findMany({
        where: {
          NOT: {
            permanent: false,
            periodTime: 0,
            days: 0,
          },
        },
      });

      if (banUsers) {
        return NextResponse.json({ ok: true, users: banUsers });
      } else return NextResponse.json({ ok: false });
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
