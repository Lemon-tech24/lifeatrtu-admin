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
      const posts = await prisma.post.findMany({
        skip: skip,
        take: take,

        include: {
          _count: {
            select: {
              reports: true,
            },
          },

          comments: true,
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
        },

        orderBy: {
          reports: {
            _count: order === "most" ? "desc" : "asc",
          },
        },
      });
      const updated = posts.filter(
        (post) =>
          post._count.reports > 0 &&
          post._count.reports < 20 &&
          !post.reports.some((report) =>
            ["violence", "suicide", "harassment"].includes(report.reason),
          ),
      );

      return NextResponse.json(updated);
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
