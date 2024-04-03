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
  usePDF,
  View,
} from "@react-pdf/renderer";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRequest } from "ahooks";
import toast from "react-hot-toast";
import ReactPDFChart from "react-pdf-charts";
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
import moment from "moment";
import BarGraph, { CustomLegend } from "../BarGraph";

const tableData = [
  {
    email: "user1@example.com",
    title: "Post 1",
    focus: "Focus 1",
    content: "asd asdasdasdasdas dsdasd asda",
    riskCategory: "Low",
  },
  {
    email: "user2@example.com",
    title: "Post 2",
    focus: "Focus 2",
    content: "Content 2",
    riskCategory: "Medium",
  },
  {
    email: "user3@example.com",
    title: "Post 3",
    focus: "Focus 3",
    content: "Content 3",
    riskCategory: "High",
  },
];

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

  const { data, loading } = useRequest(getHighRisk, {
    refreshDeps: [session, selectionRange],
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
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
      height: 40, // Set a fixed height for each row
    },
    tableColHeader: {
      width: "20%", // Adjusted width for each column header
      borderStyle: "solid",
      borderWidth: 1,
      textAlign: "center",
      fontWeight: "bold",
    },
    tableCell: {
      width: "20%", // Adjusted width for each cell
      borderStyle: "solid",
      borderWidth: 1,
      textAlign: "center",
      fontSize: 10, // Set font size to 10px
    },
  });

  const HighAudit = ({ data }: any) => (
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.section}>
        <Text>
          High Risk Category from{" "}
          {moment(selectionRange.startDate).format("ll")} to{" "}
          {moment(selectionRange.endDate).format("ll")}
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
          Low Risk Category from {moment(selectionRange.startDate).format("ll")}{" "}
          to {moment(selectionRange.endDate).format("ll")}
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
            console.log(item);
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

  const AuditReportPDF = ({ data }: any) =>
    data && (
      <Document>
        {data.high.length !== 0 && <HighAudit data={data.high} />}
        {data.low.length !== 0 && <LowAudit data={data.low} />}
      </Document>
    );

  return (
    hydrate && (
      <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
        <div
          className="w-9/12 rounded-xl gap-10 p-6"
          style={{ backgroundColor: "#D9D9D9" }}
        >
          <div className="w-full flex items-center justify-center uppercase text-3xl font-semibold">
            Export Data
          </div>

          <div className="w-full flex items-center justify-center px-2 gap-4">
            <div className="flex flex-col items-center justify-start w-full gap-2">
              <DateRangePicker
                className="w-full h-full flex justify-center"
                ranges={[selectionRange]}
                onChange={handleSelect}
                maxDate={new Date()}
              />
            </div>

            <div className="flex flex-col items-center justify-start w-full gap-2">
              {loading && <span className="loading loading-dots w-20"></span>}
              {data &&
                data !== 0 &&
                !loading &&
                (data.high.length !== 0 || data.low.length !== 0) && (
                  <PDFViewer height="500px" width="100%">
                    <AuditReportPDF data={data} />
                  </PDFViewer>
                )}

              {!loading && data.high.length === 0 && data.low.length === 0 && (
                <>No Data</>
              )}
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-4 mt-4">
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
