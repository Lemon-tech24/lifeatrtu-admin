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
          className="flex items-center gap-1 tooltip"
          data-tip={`${entry.value === "highRisk" ? "Suicidal, Violence, Harassment" : ""}`}
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

const BarGraph = ({ data }: any) => {
  return (
    <ResponsiveContainer>
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
  );
};

export default BarGraph;
