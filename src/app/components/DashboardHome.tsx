"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import moment from "moment";
import prisma from "../lib/prisma";

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const getPath = (x: any, y: any, width: any, height: any) => {
  const radius = 18;

  return `M${x},${y + height}
    H${x + width}
    V${y + radius}
    Q${x + width},${y} ${x + width - radius},${y}
    H${x + radius}
    Q${x},${y} ${x},${y + radius}
    Z`;
};
const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

const TriangleBar = (props: any) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
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
          <span className="font-semibold text-sm">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const DashboardHome = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>();
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    const controller = new AbortController();
    const getReports = async () => {
      try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 6);

        const endOfWeek = new Date(today);

        const start = startOfWeek.toISOString();
        const end = endOfWeek.toISOString();

        const response = await axios.post("/api/reports/read", {
          start: start,
          end: end,
          signal: controller.signal,
        });

        const resData = response.data;
      } catch (err) {
        throw new Error("ERROR");
      }
    };

    getReports();
    return () => controller.abort();
  }, [session, date]);

  /// useRequest

  return (
    <>
      <select
        className="absolute top-2 right-4 text-xl outline-none rounded-xl shadow-sm px-2"
        disabled={status === "loading" || !session ? true : false}
        defaultValue={"week"}
      >
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="overall">All Time</option>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="createdAt" />
            <YAxis allowDecimals={false} />

            <Legend content={<CustomLegend />} align="center" />

            <Bar
              dataKey="highRisk"
              fill="red"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              dataKey="lowRisk"
              fill="blue"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DashboardHome;
