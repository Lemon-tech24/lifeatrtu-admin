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

const CustomLegend = ({ payload }: any) => {
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
            className="w-10 h-20 md:w-8 md:h-16 sm:h-10 inline-block rounded-3xl"
          ></span>
          <span className="font-semibold text-xl">
            {entry.value === "highRisk" ? "High Risk" : "Low Risk"}
          </span>
        </li>
      ))}
    </ul>
  );
};

const BarGraph = ({ data }: any) => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        width={400}
        height={200}
        margin={{ top: 15, right: 10, bottom: 5, left: -28 }}
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
  );
};

export default BarGraph;
