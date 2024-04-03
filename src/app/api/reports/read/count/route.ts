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
      const reportCounts: any = {};

      reportCounts["Hate Speech"] = await prisma.report.count({
        where: {
          reasons: {
            has: "hate speech",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      reportCounts["False Information"] = await prisma.report.count({
        where: {
          reasons: {
            has: "false information",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      reportCounts["Harassment"] = await prisma.report.count({
        where: {
          reasons: {
            has: "harassment",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      reportCounts["Nudity"] = await prisma.report.count({
        where: {
          reasons: {
            has: "nudity",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      reportCounts["Spam"] = await prisma.report.count({
        where: {
          reasons: {
            has: "spam",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      reportCounts["Suicidal"] = await prisma.report.count({
        where: {
          reasons: {
            has: "suicidal or self injury",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      reportCounts["Violence"] = await prisma.report.count({
        where: {
          reasons: {
            has: "violence",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      reportCounts["Something Else"] = await prisma.report.count({
        where: {
          reasons: {
            has: "something else",
          },
          AND: {
            createdAt: {
              gte: start,
              lte: end,
            },
            disregard: false,
          },
        },
      });

      const list = Object.keys(reportCounts).map((reason) => ({
        name: reason,
        value: reportCounts[reason],
      }));

      return NextResponse.json({ ok: true, pieData: list });
    } else {
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }
  } catch (err) {
    throw new Error("Error");
  }
}
