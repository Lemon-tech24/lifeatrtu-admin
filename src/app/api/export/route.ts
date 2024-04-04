import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { start, end } = await request.json();
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const reports = await prisma.post.findMany({
        where: {
          reports: {
            some: {
              AND: [
                {
                  createdAt: {
                    gte: start,
                    lte: end,
                  },
                },
                {
                  reasons: {
                    hasSome: [
                      "violence",
                      "suicidal or self injury",
                      "harassment",
                    ],
                  },
                },
              ],
            },
          },
        },
        include: {
          reports: {
            where: {
              createdAt: {
                gte: start,
                lte: end,
              },

              reasons: {
                hasSome: ["violence", "suicidal or self injury", "harassment"],
              },
            },
          },
          user: true,
        },
        distinct: ["id"],
        orderBy: {
          createdAt: "asc",
        },
      });

      const reportsLow = await prisma.post.findMany({
        where: {
          reports: {
            some: {
              AND: [
                {
                  createdAt: {
                    gte: start,
                    lte: end,
                  },
                },
                {
                  NOT: {
                    reasons: {
                      hasSome: [
                        "violence",
                        "suicidal or self injury",
                        "harassment",
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        include: {
          reports: {
            where: {
              createdAt: {
                gte: start,
                lte: end,
              },
              NOT: {
                reasons: {
                  hasSome: [
                    "violence",
                    "suicidal or self injury",
                    "harassment",
                  ],
                },
              },
            },
          },
          user: true,
        },
        distinct: ["id"],

        orderBy: {
          createdAt: "asc",
        },
      });

      if (reports || reportsLow) {
        return NextResponse.json({ high: reports, low: reportsLow });
      } else {
        return NextResponse.json({ msg: "No reports found" });
      }
    } else {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }
  } catch (err) {
    throw new Error("Error");
  }
}
