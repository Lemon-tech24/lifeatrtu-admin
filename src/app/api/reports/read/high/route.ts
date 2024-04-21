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
        where: {
          AND: [
            {
              reason: { not: null },
            },
            {
              reported: false,
            },
            {
              pending: false,
            },
          ],
          user: {
            is: {
              blacklists: {
                every: {
                  AND: {
                    periodTime: {
                      equals: 0,
                    },

                    days: {
                      equals: 0,
                    },

                    permanent: {
                      equals: false,
                    },
                  },
                },
              },
            },
          },
          reports: {
            some: {
              disregard: false,
            },
          },
        },
        include: {
          _count: {
            select: {
              reports: {},
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
        },

        orderBy: {
          reports: {
            _count: order === "most" ? "desc" : "asc",
          },
        },
      });

      if (posts) {
        const updatedPosts = posts.filter((post) => {
          return (
            (post._count.reports > 0 && post._count.reports > 20) ||
            ["violence", "suicidal or self injury", "harassment"].includes(
              post.reason as string,
            )
          );
        });

        return NextResponse.json(updatedPosts);
      }
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
