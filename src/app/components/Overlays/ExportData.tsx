/* eslint-disable react-hooks/exhaustive-deps */
import {
  isOpenExportData,
  isOpenReport,
  isOpenSettings,
} from "@/app/lib/useStore";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Document,
  Page,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRequest } from "ahooks";
import ReactPDFChart from "react-pdf-charts";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import moment from "moment";
import { COLORS, renderCustomizedLabel } from "../PieGraph";

interface Range {
  startDate: Date;
  endDate: Date;
  key: string;
}

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

const ExportData = () => {
  const { close } = isOpenExportData();
  const settings = isOpenSettings();
  const [hydrate, setHydrate] = useState<boolean>(false);
  const { data: session } = useSession();
  const [selectionRange, setSelectionRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  useEffect(() => {
    setHydrate(true);
  }, []);

  const getHighRisk = async () => {
    const { startDate, endDate } = selectionRange;

    try {
      if (startDate && endDate) {
        const startUTC8 = moment(startDate).utcOffset("+08:00").toISOString();
        const endUTC8 = moment(endDate).utcOffset("+08:00").toISOString();

        const response = await axios.post("/api/export", {
          start: startUTC8,
          end: endUTC8,
        });

        const data = response.data;

        if (data && data !== null && data !== undefined) {
          return data;
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getBarData = async () => {
    const { startDate, endDate } = selectionRange;

    try {
      if (startDate && endDate) {
        const startUTC8 = moment(startDate).utcOffset("+08:00").toISOString();
        const endUTC8 = moment(endDate).utcOffset("+08:00").toISOString();

        const response = await axios.post("/api/reports/read", {
          start: startUTC8,
          end: endUTC8,
        });

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

        const data = response.data;

        if (data && data.ok) {
          const newData = combineDataByDate(data.list);
          return newData;
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getPieDAta = async () => {
    const { startDate, endDate } = selectionRange;

    try {
      if (startDate && endDate) {
        const startUTC8 = moment(startDate).utcOffset("+08:00").toISOString();
        const endUTC8 = moment(endDate).utcOffset("+08:00").toISOString();

        const response = await axios.post("/api/reports/read/count", {
          start: startUTC8,
          end: endUTC8,
        });

        const data = response.data;

        if (data && data.ok) {
          return data.pieData;
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const bar = useRequest(getBarData, {
    refreshDeps: [session, selectionRange],
  });

  const pie = useRequest(getPieDAta, {
    refreshDeps: [session, selectionRange],
  });

  const { data, loading } = useRequest(getHighRisk, {
    refreshDeps: [session, selectionRange],
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
    },

    tableRow: {
      flexDirection: "row",
      height: 40,
    },
    tableColHeader: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      textAlign: "center",
      fontWeight: "bold",
    },
    tableCell: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      textAlign: "center",
      fontSize: 10,
    },
  });

  const HighAudit = ({ data }: any) => (
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.section}>
        <Text>
          High Risk Category from{" "}
          {moment(selectionRange.startDate).utcOffset("+08:00").format("ll")} to{" "}
          {moment(selectionRange.endDate).utcOffset("+08:00").format("ll")}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Author</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Title</Text>
            </View>

            <View style={styles.tableColHeader}>
              <Text>Focus</Text>
            </View>

            <View style={styles.tableColHeader}>
              <Text>Content</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Date Posted</Text>
            </View>
          </View>
          {data.map((item: any, index: any) => {
            return (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{item.user.email}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.title}</Text>
                </View>

                <View style={styles.tableCell}>
                  <Text>{item.focus}</Text>
                </View>

                <View style={styles.tableCell}>
                  <Text>{item.content}</Text>
                </View>

                <View style={styles.tableCell}>
                  <Text>{moment(item.createdAt).format("lll")}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Page>
  );

  const LowAudit = ({ data }: any) => (
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.section}>
        <Text>
          Low Risk Category from{" "}
          {moment(selectionRange.startDate).utcOffset("+08:00").format("ll")} to{" "}
          {moment(selectionRange.endDate).utcOffset("+08:00").format("ll")}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Author</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Title</Text>
            </View>

            <View style={styles.tableColHeader}>
              <Text>Focus</Text>
            </View>

            <View style={styles.tableColHeader}>
              <Text>Content</Text>
            </View>

            <View style={styles.tableColHeader}>
              <Text>Date Posted</Text>
            </View>
          </View>
          {data.map((item: any, index: any) => {
            return (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{item.user.email}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.title}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.focus}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.content}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{moment(item.createdAt).format("lll")}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Page>
  );

  const BarA = ({ data }: any) => {
    return (
      data && (
        <Page size="A4" style={styles.page} orientation="landscape">
          <View style={styles.section}>
            <Text>
              High/Low Risk Graph from{" "}
              {moment(selectionRange.startDate)
                .utcOffset("+08:00")
                .format("ll")}{" "}
              to{" "}
              {moment(selectionRange.endDate).utcOffset("+08:00").format("ll")}
            </Text>

            <ReactPDFChart>
              <BarChart
                width={800}
                height={500}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: -35,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="date" className="text-xs" interval={0} />
                <YAxis
                  allowDecimals={false}
                  tickCount={10}
                  className="text-base"
                />

                <Legend align="center" />
                <Bar
                  dataKey="lowRisk"
                  fill="#289dd2"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                  radius={[20, 20, 0, 0]}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="lowRisk"
                    position={"top"}
                    className="text-xl"
                    fontWeight={"bold"}
                  />
                </Bar>
                <Bar
                  dataKey="highRisk"
                  fill="#E8C872"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                  radius={[20, 20, 0, 0]}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="highRisk"
                    position={"top"}
                    className="text-xl"
                    fontWeight={"bold"}
                  />
                </Bar>
              </BarChart>
            </ReactPDFChart>
          </View>
        </Page>
      )
    );
  };

  const PieA = ({ data }: any) => {
    return (
      data && (
        <Page size="A4" style={styles.page} orientation="landscape">
          <View style={styles.section}>
            <Text>
              Reports Graph from{" "}
              {moment(selectionRange.startDate)
                .utcOffset("+08:00")
                .format("ll")}{" "}
              to{" "}
              {moment(selectionRange.endDate).utcOffset("+08:00").format("ll")}
            </Text>

            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ReactPDFChart>
                <PieChart
                  width={500}
                  height={500}
                  margin={{ left: 0, right: -100, bottom: 0, top: 0 }}
                >
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                    isAnimationActive={false}
                  >
                    {data.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Legend />
                </PieChart>
              </ReactPDFChart>
            </View>
          </View>
        </Page>
      )
    );
  };
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

  const AuditReportPDF = ({ data }: any) =>
    data && (
      <Document>
        {data.high.length !== 0 && <HighAudit data={data.high} />}
        {data.low.length !== 0 && <LowAudit data={data.low} />}
        {bar.data && bar.data.length !== 0 && <BarA data={bar.data} />}
        {bar.data && bar.data.length !== 0 && pie.data && (
          <PieA data={pie.data} />
        )}
      </Document>
    );
  return (
    hydrate && (
      <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
        <div
          className="w-9/12 rounded-xl gap-10 p-6 2xl:w-11/12 lg:p-2 md:w-full md:h-full md:rounded-none"
          style={{ backgroundColor: "#D9D9D9" }}
        >
          <div className="w-full flex items-center justify-center uppercase text-3xl font-semibold">
            Export Data
          </div>

          <div className="w-full flex items-center justify-center px-2 gap-4 md:flex-col">
            <div className="flex flex-col items-center justify-start w-full gap-2 h-1/2 overflow-auto">
              <DateRangePicker
                className="w-full h-full flex justify-center"
                ranges={[selectionRange]}
                onChange={handleSelect}
                maxDate={new Date()}
              />
            </div>

            <div className="flex flex-col items-center justify-start w-full gap-2">
              {(loading || bar.loading || pie.loading) && (
                <span className="loading loading-dots w-20"></span>
              )}
              {!loading &&
                data &&
                data !== 0 &&
                (!loading || !bar.loading || !pie.loading) &&
                (data.high.length !== 0 ||
                data.low.length !== 0 ||
                (bar.data && bar.data.length !== 0 && pie.data) ? (
                  <PDFViewer
                    style={{
                      width: "100%",
                      height: width < 767 ? "400px" : "500px",
                    }}
                  >
                    <AuditReportPDF data={data} />
                  </PDFViewer>
                ) : (
                  <div className="text-xl font-semibold">No Data</div>
                ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-4 mt-4">
            {!loading &&
              data &&
              data !== 0 &&
              (!loading || !bar.loading || !pie.loading) &&
              (data.high.length !== 0 ||
                data.low.length !== 0 ||
                (bar.data && bar.data.length !== 0 && pie.data)) && (
                <button
                  className="text-lg font-semibold rounded-lg px-2 bg-green-700"
                  disabled={loading || bar.loading || pie.loading}
                >
                  <PDFDownloadLink
                    document={<AuditReportPDF data={data} />}
                    fileName={`LifeAtRTU_${moment(selectionRange.startDate).format("ll")}_to_${moment(selectionRange.endDate).format("ll")}`}
                  >
                    {({ loading }) =>
                      loading ? "Loading document..." : "Download PDF"
                    }
                  </PDFDownloadLink>
                </button>
              )}

            <button
              className="text-lg font-semibold rounded-lg px-2"
              style={{ backgroundColor: "#FF3F3F" }}
              onClick={() => {
                close();
                settings.open();
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ExportData;
