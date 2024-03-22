import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#637A9F",
  "#FFF3CF",
  "#FFE7CC",
  "#FBD1B7",
  "#289dd2",
  "#E8C872",
  "#FFE9AE",
  "#ED9761",
];

const CustomLegend = ({ payload }: any) => {
  const firstRowData = payload.slice(0, 4);
  const secondRowData = payload.slice(4);
  console.log(payload);
  return (
    <div className="flex justify-center flex-col border border-black border-solid w-4/6 lg:w-5/6 md:w-[95%] sm:w-[97%] p-4 m-auto xs:h-full rounded-2xl mb-2 sm:gap-1">
      <div className="w-full flex items-center justify-evenly">
        {firstRowData.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="w-48 flex items-center gap-2 xs:w-full"
          >
            <span
              style={{
                backgroundColor: entry.color,
              }}
              className="rounded-full w-4 h-4"
            ></span>
            <div className="font-semibold text-lg md:text-base sm:text-xs text-ellipsis line-clamp-1">
              {entry.value}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-evenly">
        {secondRowData.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="w-48 flex items-center gap-2 xs:w-full"
          >
            <span
              style={{
                backgroundColor: entry.color,
              }}
              className="rounded-full w-4 h-4 xs:w-2 xs:h-2"
            ></span>
            <div className="font-semibold text-lg md:text-base sm:text-xs text-ellipsis line-clamp-1">
              {entry.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieGraph = ({ data }: any) => {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    name,
    percent,
  }: any) => {
    if (percent === 0) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = 1.02 * outerRadius;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="xs:hidden"
        fontSize={13}
        fontWeight={700}
      >
        {name}
        <tspan x={x} dy="1rem">
          {`${(percent * 100).toFixed(0)}%`}
        </tspan>
      </text>
    );
  };
  const legendData = data.map((entry: any, index: number) => ({
    value: entry.name,
    type: "circle",
    color: COLORS[index % COLORS.length],
  }));

  const firstRowData = legendData.slice(0, 4);
  const secondRowData = legendData.slice(4, 8);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          fill="#8884d8"
          dataKey="value"
          label={renderCustomizedLabel}
        >
          {data.map((entry: any, index: any) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [
            value,
            name,
            props.payload.percent,
          ]}
        />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieGraph;
