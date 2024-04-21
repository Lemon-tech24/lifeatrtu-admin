import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { postId, category } = await request.json();

  const session = await getServerSession(authOptions);

  try {
    if (session) {
      const categorizedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          reason: category,
          reported: false,
          pending: false,
        },
      });

      if (categorizedPost) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ ok: false });
    } else {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }
  } catch (err) {
    throw new Error("Error");
  }
}
