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
  "#C9D7DD",
  "#E8C872",
  "#FFE9AE",
  "#ED9761",
];

const CustomLegend = ({ payload }: any) => {
  const firstRowData = payload.slice(0, 4);
  const secondRowData = payload.slice(4);
  return (
    <div className="flex justify-center flex-col border border-black border-solid w-4/6 p-4 m-auto rounded-2xl mb-2">
      <div className="w-full flex items-center justify-evenly">
        {firstRowData.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="w-48 flex items-center gap-2">
            <span
              style={{
                backgroundColor: entry.color,
              }}
              className="rounded-full w-4 h-4"
            ></span>
            <div className="font-semibold text-lg">{entry.value}</div>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-evenly">
        {secondRowData.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="w-48 flex items-center gap-2">
            <span
              style={{
                backgroundColor: entry.color,
              }}
              className="rounded-full w-4 h-4"
            ></span>
            <div className="font-semibold text-lg">{entry.value}</div>
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
    const radius = 1.2 * outerRadius;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#8884d8"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {name}
        <tspan x={x} dy="1.2em">
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
          outerRadius={220}
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
