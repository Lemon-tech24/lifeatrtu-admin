/* eslint-disable react-hooks/exhaustive-deps */
import { isOpenExportData, isOpenSettings } from "@/app/lib/useStore";
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
  XAxis,
  YAxis,
} from "recharts";

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
  const { data: session } = useSession();
  const [selectionRange, setSelectionRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges: any) => {
    if (ranges) {
      setSelectionRange(ranges.selection);
    }
  };

  const BarGraphData = async () => {
    try {
      const response = await axios.post("/api/reports/read", {
        start: selectionRange.startDate,
        end: selectionRange.endDate,
      });
      const data = response.data;

      if (data.ok) {
        const newData = combineDataByDate(data.list);
        return newData;
      } else {
        if (data.msg) toast.error(data.msg);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      display: "flex",
      flexDirection: "column",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      width: "100%",
    },
    textColumn: { fontSize: 20 },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
      fontSize: 20,
    },
    tableCell: {
      padding: 5,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      flexGrow: 1,
      width: `${100 / 5}%`,
      fontSize: 12,
    },
    tableText: {
      textAlign: "justify",
    },
  });

  const bar = useRequest(BarGraphData, {
    refreshDeps: [session, selectionRange],
  });

  const AuditReportPDF = () => (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape"></Page>
    </Document>
  );

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl gap-10 p-6"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-3xl font-semibold">
          Export Data
        </div>

        <PDFViewer height="100%" width="100%">
          <AuditReportPDF />
        </PDFViewer>

        <div className="w-full flex items-center justify-center flex-col px-10 gap-4">
          <div className="flex items-center justify-start w-full gap-2">
            <p className="text-2xl">Custom Range</p>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-4 mt-4">
          <button
            disabled={
              selectionRange.startDate === null ||
              selectionRange.startDate === undefined
                ? true
                : false
            }
            className={`${
              selectionRange.startDate === null ||
              selectionRange.startDate === undefined
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <PDFDownloadLink
              document={<AuditReportPDF />}
              fileName="exportData.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
          </button>
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
  );
};

export default ExportData;
