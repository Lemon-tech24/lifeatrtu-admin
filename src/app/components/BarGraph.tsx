import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="flex list-none items-center justify-evenly">
      {payload.map((entry: any, index: any) => (
        <li
          key={`legend-${index}`}
          className="flex items-center justify-center tooltip text-xl"
          data-tip={`${entry.value === "highRisk" ? "Suicidal, Violence, Harassment" : "Hate Speech, False Info., Nudity, Something Else, Spam"}`}
        >
          <span
            style={{
              backgroundColor: entry.color,
            }}
            className="w-10 h-20 md:w-6 md:h-14 sm:h-8 inline-block rounded-3xl"
          ></span>
          <span className="font-semibold text-xl md:text-base">
            {entry.value === "highRisk" ? "High Risk" : "Low Risk"}
          </span>
        </li>
      ))}
    </ul>
  );
};

const BarGraph = ({ data }: any) => {
  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        width={1000}
        height={500}
        margin={{ top: 15, right: 10, bottom: 5, left: -32 }}
      >
        <CartesianGrid
          strokeDasharray="0"
          strokeWidth={3}
          color="black"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          className="text-xl xl:text-xs md:text-[8px]"
          allowDataOverflow
        />
        <YAxis
          allowDecimals={false}
          tickCount={10}
          className="text-xl md:text-base"
        />

        <Legend align="center" content={<CustomLegend />} />
        <Bar
          dataKey="lowRisk"
          fill="#289dd2"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
          radius={[20, 20, 0, 0]}
        >
          <LabelList
            dataKey="lowRisk"
            position={"top"}
            className="text-xl md:text-base"
            fontWeight={"bold"}
          />
        </Bar>
        <Bar
          dataKey="highRisk"
          fill="#E8C872"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
          radius={[20, 20, 0, 0]}
        >
          <LabelList
            dataKey="highRisk"
            position={"top"}
            className="text-xl md:text-base"
            fontWeight={"bold"}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
