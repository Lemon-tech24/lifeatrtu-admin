import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { skip, take, order } = await request.json();

  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const pendingPosts = await prisma.post.findMany({
        skip: skip,
        take: take,

        where: {
          pending: true,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reports: {
            select: {
              reason: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },

        orderBy: {
          reports: {
            _count: order === "most" ? "desc" : "asc",
          },
        },
      });

      return NextResponse.json(pendingPosts);
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}