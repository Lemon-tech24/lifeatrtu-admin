"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Rectangle,
  LabelList,
  PieChart,
  Pie,
} from "recharts";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import { useRequest } from "ahooks";
import BarGraph from "./BarGraph";
import PieGraph from "./PieGraph";

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const DashboardHome = () => {
  const { data: session, status } = useSession();
  const [graph, setGraph] = useState<string>("bar");
  const [selected, setSelected] = useState<string>("");

  const getReportsData = async () => {
    const controller = new AbortController();
    const { start, end } = generateDateRanges(selected);
    try {
      const response = await axios.post("/api/reports/read", {
        start: start,
        end: end,
        signal: controller.signal,
      });

      const data = response.data;
      const combineDataByDate = (data: any) => {
        const combinedData: any = {};
        data.forEach((item: any) => {
          if (!combinedData[item.date]) {
            combinedData[item.date] = {
              date: item.date,
              highRisk: 0,
              lowRisk: 0,
            };
          }
          combinedData[item.date].highRisk += item.highRisk;
          combinedData[item.date].lowRisk += item.lowRisk;
        });
        return Object.values(combinedData);
      };
      if (data.ok) {
        const newData = combineDataByDate(data.list);
        return newData;
      }

      controller.abort();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const formatDate = (date: Date) => date.toISOString();
  const generateDateRange = (startDate: Date, endDate: Date) => {
    return { start: formatDate(startDate), end: formatDate(endDate) };
  };
  const generateDateRanges = (selectedRange: string) => {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date;

    switch (selectedRange) {
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() - 6);
        endDate = new Date(today);
        break;
      case "month":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 30);
        endDate = new Date(today);
        break;
      case "all":
        startDate = new Date(0);
        endDate = new Date(today);
        break;
      case "today":
        startDate = startOfToday;
        endDate = today;
        break;
      default:
        startDate = startOfToday;
        endDate = today;
        break;
    }

    return generateDateRange(startDate, endDate);
  };

  const { data, loading } = useRequest(getReportsData, {
    refreshDeps: [session, selected],
  });

  const getReportCounts = async () => {
    const { start, end } = generateDateRanges(selected);
    try {
      const response = await axios.post("/api/reports/read/count", {
        start: start,
        end: end,
      });

      const resData = response.data;

      if (resData.ok) {
        return resData.pieData;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const counts = useRequest(getReportCounts, {
    refreshDeps: [session, selected],
  });

  return (
    <>
      <select
        className="absolute top-2 right-4 md:right-1 text-xl lg:text-lg md:text-base md:px-1 md:shadow-sm sm:top-1 outline-none rounded-xl shadow-md px-2 border border-solid border-black"
        disabled={status === "loading" || !session ? true : false}
        defaultValue={""}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="today">Today</option>
        <option value="week">Last 7 days</option>
        <option value="month">Last 30 days</option>
        <option value="all">All Time</option>
      </select>
      {/* ------------------------------------------------ */}
      <div className="text-7xl lg:text-6xl sm:text-5xl xs:text-3xl font-bold w-full p-10 lg:p-6 md:pt-8 md:p-4 xs:p-4 xs:pt-8 text-center">
        Life@RTU REPORT
      </div>

      <div className="w-full flex items-center justify-center gap-4 md:px-2">
        <button
          type="button"
          className={`w-1/5 2xl:w-2/5 md:w-3/5 sm:text-base xs:text-xs font-semibold shadow-md px-2 rounded-xl text-xl ${graph !== "" && graph === "bar" ? "bg-slate-300 animate-fadeIn" : "border border-black border-solid animate-fadeIn"}`}
          onClick={() => setGraph("bar")}
        >
          High/Low Risk Reports
        </button>
        <button
          type="button"
          className={`w-1/5 2xl:w-2/5 md:w-3/5 sm:text-base xs:text-xs font-semibold shadow-md px-2 rounded-xl  text-xl  ${graph !== "" && graph === "pie" ? "bg-slate-300 animate-fadeIn" : "border border-black border-solid animate-fadeIn"}`}
          onClick={() => setGraph("pie")}
        >
          Reports
        </button>
      </div>
      <div
        className={`flex-grow ${(loading || data?.length === 0) && "flex w-full h-full items-center justify-center overflow-auto"}`}
      >
        {loading ? (
          <div className="loading loading-dots w-20"></div>
        ) : data && data.length === 0 ? (
          <div className="text-2xl font-semibold sm:text-base">
            No Reports to Display
          </div>
        ) : graph !== "" && graph === "bar" ? (
          <BarGraph data={data} />
        ) : (
          <PieGraph data={counts.data} />
        )}
      </div>
    </>
  );
};

export default DashboardHome;
