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
      const reportCounts = {
        hateSpeech: await prisma.report.count({
          where: {
            post: {
              reason: "hate speech",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),

        falseInfo: await prisma.report.count({
          where: {
            post: {
              reason: "false information",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),

        harassment: await prisma.report.count({
          where: {
            post: {
              reason: "harassment",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),

        nudity: await prisma.report.count({
          where: {
            post: {
              reason: "nudity",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),

        spam: await prisma.report.count({
          where: {
            post: {
              reason: "spam",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),

        suicidal: await prisma.report.count({
          where: {
            post: {
              reason: "suicidal or self injury",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),

        violence: await prisma.report.count({
          where: {
            post: {
              reason: "violence",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),

        somethingElse: await prisma.report.count({
          where: {
            post: {
              reason: "something else",
            },
            AND: [
              {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
              {
                disregard: false,
              },
            ],
          },
        }),
      };

      const nameMapping: Record<string, string> = {
        hateSpeech: "Hate Speech",
        falseInfo: "False Information",
        harassment: "Harassment",
        nudity: "Nudity",
        spam: "Spam",
        suicidal: "Suicidal",
        violence: "Violence",
        somethingElse: "Something Else",
      };

      const list = Object.keys(reportCounts).map((reason) => ({
        name: nameMapping[reason as keyof typeof nameMapping],
        value: reportCounts[reason as keyof typeof reportCounts],
      }));
      return NextResponse.json({ ok: true, pieData: list });
    } else {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }
  } catch (err) {
    throw new Error("Error");
  }
}
