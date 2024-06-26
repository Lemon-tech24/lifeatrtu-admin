import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { list } = await request.json();
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const deletePost = await prisma.post.deleteMany({
        where: {
          id: { in: list },
        },
      });

      if (deletePost) {
        return NextResponse.json({ ok: true });
      } else return NextResponse.json({ ok: false });
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
