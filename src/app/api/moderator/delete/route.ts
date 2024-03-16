import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const deleteMod = await prisma.account.delete({
        where: {
          id: id,
        },
      });

      if (deleteMod) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ ok: false });
    } else
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      );
  } catch (err) {
    throw new Error("Error");
  }
}
