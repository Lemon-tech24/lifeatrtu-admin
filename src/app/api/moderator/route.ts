import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const mods = await prisma.account.findMany();

      return NextResponse.json({ ok: true, mods: mods });
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
