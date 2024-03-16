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
  "blue",
  "green",
  "orange",
  "red",
  "purple",
  "pink",
  "cyan",
  "yellow",
];

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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={250}
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieGraph;
