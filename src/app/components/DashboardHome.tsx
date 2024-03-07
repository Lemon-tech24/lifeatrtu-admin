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
} from "recharts";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

import { useRequest } from "ahooks";

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const CustomLegend = ({ payload }: any) => {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        display: "flex",
        flex: "flex-column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {payload.map((entry: any, index: any) => (
        <li
          key={`legend-${index}`}
          style={{ marginLeft: "100px", marginRight: "100px" }}
          className="flex items-center gap-1"
        >
          <span
            style={{
              backgroundColor: entry.color,
            }}
            className="w-10 h-20 inline-block rounded-3xl"
          ></span>
          <span className="font-semibold text-xl">
            {entry.value === "highRisk" ? "High Risk" : "Low Risk"}
          </span>
        </li>
      ))}
    </ul>
  );
};

const DashboardHome = () => {
  const { data: session, status } = useSession();

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

  return (
    <>
      <select
        className="absolute top-2 right-4 text-xl outline-none rounded-xl shadow-md px-2 border border-solid border-black"
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
      <div className="text-7xl font-bold w-full p-10 text-center">
        Life@RTU REPORT
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="0"
              strokeWidth={3}
              color="black"
              vertical={false}
            />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} tickCount={10} />

            <Legend align="center" content={<CustomLegend />} />
            <Bar
              dataKey="lowRisk"
              fill="blue"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
              radius={[20, 20, 0, 0]}
            >
              <LabelList
                dataKey="lowRisk"
                position={"top"}
                fontSize={20}
                fontWeight={"bold"}
              />
            </Bar>
            <Bar
              dataKey="highRisk"
              fill="red"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
              radius={[20, 20, 0, 0]}
            >
              <LabelList
                dataKey="highRisk"
                position={"top"}
                fontSize={20}
                fontWeight={"bold"}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DashboardHome;
