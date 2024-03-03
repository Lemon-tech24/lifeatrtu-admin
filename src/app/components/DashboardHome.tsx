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
} from "recharts";
import React from "react";

const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const data = [
  {
    name: "Page A",
    uv: 15,
    pv: 9,
  },
  {
    name: "Page B",
    uv: 9,
    pv: 9,
  },
  {
    name: "Page C",
    uv: 2,
    pv: 9,
  },
  {
    name: "Page D",
    uv: 2,
    pv: 3,
  },
];
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
          <span className="font-semibold text-sm">
            {entry.value === "uv"
              ? "Low Risk"
              : entry.value === "pv"
                ? "High Risk"
                : "Guidance"}
          </span>
        </li>
      ))}
    </ul>
  );
};

const DashboardHome = () => {
  return (
    <>
      <div>Life@RTU REPORT</div>
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
            <XAxis dataKey="name" />
            <YAxis tickCount={10} />

            <Legend content={<CustomLegend />} align="center" />
            <Bar
              dataKey="uv"
              fill="blue"
              shape={<TriangleBar />}
              label={{ position: "top" }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={"blue"} />
              ))}
            </Bar>
            <Bar
              dataKey="pv"
              fill="red"
              shape={<TriangleBar />}
              label={{ position: "top" }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={"red"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DashboardHome;
