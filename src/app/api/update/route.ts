import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { comment, postId } = await request.json();
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const addUpdates = await prisma.update.create({
        data: {
          comment: comment,
          author: session.user?.name as string,
          postId: postId,
        },
      });

      if (addUpdates) {
        return NextResponse.json({ ok: true, msg: "Update Added" });
      } else
        return NextResponse.json({ ok: false, msg: "Failed to add Update" });
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
