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
          reason: {
            equals: "hate speech",
          },

          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      reportCounts["False Information"] = await prisma.report.count({
        where: {
          reason: {
            equals: "false information",
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      reportCounts["Harassment"] = await prisma.report.count({
        where: {
          reason: {
            equals: "harassment",
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      reportCounts["Nudity"] = await prisma.report.count({
        where: {
          reason: {
            equals: "nudity",
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      reportCounts["Spam"] = await prisma.report.count({
        where: {
          reason: {
            equals: "spam",
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      reportCounts["Suicidal"] = await prisma.report.count({
        where: {
          reason: {
            equals: "suicidal or self injury",
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      reportCounts["Violence"] = await prisma.report.count({
        where: {
          reason: {
            equals: "violence",
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      reportCounts["Something Else"] = await prisma.report.count({
        where: {
          reason: {
            equals: "something else",
          },
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      const list = Object.keys(reportCounts).map((reason) => ({
        name: reason,
        value: reportCounts[reason],
      }));

      return NextResponse.json({ ok: true, pieData: list });
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
