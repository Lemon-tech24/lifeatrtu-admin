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
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
          user: {
            NOT: {
              blacklists: {
                some: {},
              },
            },
          },
        },
        select: {
          reports: true,
        },
      });
      const categorizedReports = reports.map((post) => ({
        ...post,
        reportsByDate: post.reports.reduce((acc: any, report) => {
          const reportDate = new Date(report.createdAt).toDateString();

          if (acc[reportDate]) {
            if (
              report.reason === "harassment" ||
              report.reason === "violence" ||
              report.reason === "suicide"
            ) {
              acc[reportDate].highRisk++;
            } else {
              acc[reportDate].lowRisk++;
            }
          } else {
            acc[reportDate] = { highRisk: 0, lowRisk: 0 };

            if (
              report.reason === "harassment" ||
              report.reason === "violence" ||
              report.reason === "suicidal or self injury"
            ) {
              acc[reportDate].highRisk++;
            } else {
              acc[reportDate].lowRisk++;
            }
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
      return NextResponse.json({ ok: true, list: data });
    } else
      return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  } catch (err) {
    throw new Error("Error");
  }
}
