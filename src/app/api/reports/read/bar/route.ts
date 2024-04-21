import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import moment from "moment";
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
          reason: {
            not: {
              equals: null,
            },
          },
          reported: false,
          reports: {
            some: {
              createdAt: {
                gte: start,
                lte: end,
              },
              disregard: false,
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
              disregard: false,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const categorizedReports = reports.map((post) => ({
        reportsByDate: post.reports.reduce((acc: any, report) => {
          const reportDate = new Date(report.createdAt).toLocaleDateString(
            undefined,
            { month: "short", day: "numeric", year: "numeric" },
          );

          if (!acc[reportDate]) {
            acc[reportDate] = { highRisk: 0, lowRisk: 0 };
          }

          if (
            post.reason !== "" &&
            post.reason !== null &&
            ["harassment", "violence", "suicidal or self injury"].includes(
              post.reason,
            )
          ) {
            acc[reportDate].highRisk++;
          } else {
            acc[reportDate].lowRisk++;
          }
          return acc;
        }, {}),
      }));

      const data = categorizedReports
        .map((post) => {
          const reportByDate = post.reportsByDate;
          const dates = Object.keys(reportByDate);
          const result: any = [];

          dates.forEach((date) => {
            const highRiskCount = reportByDate[date].highRisk;
            const lowRiskCount = reportByDate[date].lowRisk;

            result.push({
              date,
              highRisk: highRiskCount,
              lowRisk: lowRiskCount,
            });
          });

          return result;
        })
        .flat();

      data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });

      return NextResponse.json({ ok: true, list: data });
    } else {
      return NextResponse.json(
        { ok: false, message: "UNAUTHORIZED" },
        { status: 401 },
      );
    }
  } catch (err) {
    throw new Error("Error");
  }
}
