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
        },
        select: {
          reports: true,
        },
      });
      const categorizedReports = reports.map((post) => ({
        ...post,
        reportsByDate: post.reports.reduce((acc: any, report) => {
          const reportDate = new Date(report.createdAt).toDateString();

          // Check if a report with the same date already exists in the accumulator
          if (acc[reportDate]) {
            // Increment the count of reports based on the reason
            if (
              report.reason === "hate speech" ||
              report.reason === "violence" ||
              report.reason === "suicide"
            ) {
              acc[reportDate].highRisk++;
            } else {
              acc[reportDate].lowRisk++;
            }
          } else {
            // Create a new object for the date if it doesn't exist in the accumulator
            acc[reportDate] = { highRisk: 0, lowRisk: 0 };

            // Increment the count of reports based on the reason
            if (
              report.reason === "hate speech" ||
              report.reason === "violence" ||
              report.reason === "suicide"
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

          // Iterate through each date
          dates.forEach((date) => {
            const highRiskCount = reportByDate[date].highRisk;
            const lowRiskCount = reportByDate[date].lowRisk;

            // Create an object for each date with highRisk and lowRisk counts
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
