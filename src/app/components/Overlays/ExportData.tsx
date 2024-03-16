/* eslint-disable react-hooks/exhaustive-deps */
import { isOpenExportData, isOpenSettings } from "@/app/lib/useStore";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Document,
  PDFDownloadLink,
  PDFViewer,
  Page,
  Text,
  usePDF,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import { useSession } from "next-auth/react";
import ReactPDFChart from "react-pdf-charts";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import axios from "axios";
import { useRequest } from "ahooks";

const data = [
  { name: "A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "G", uv: 3490, pv: 4300, amt: 2100 },
];

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
  textColumn: { fontSize: "20px" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    fontSize: "20pt",
  },
  tableCell: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    flexGrow: 1,
    width: `${100 / 5}%`,
    fontSize: "12px",
  },
  tableText: {
    textAlign: "justify",
  },
});

const tableData = [
  {
    email: "user1@example.com",
    title: "Post 1",
    focus: "Focus 1",
    content:
      "asdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdsssssssssssssssssssssssssssssssssasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdaaaaassssssssssssssssssssssdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasda",
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
  {
    email: "user3@example.com",
    title: "Post 3",
    focus: "Focus 3",
    content: "Content 3",
    riskCategory: "High",
  },
  {
    email: "user3@example.com",
    title: "asdasdasdsasdasdasdssssssssssssssssssssssssssssssssss",
    focus: "asdsadasdasdas",
    content: "asdsadasdasdasd",
    riskCategory: "High",
  },
  {
    email: "user3@example.com",
    title: "asdasdddddddddddddddddd",
    focus: "Focus 3",
    content:
      "aaaaaaaaaaaaaaaaaaaaaaaaasdasddddddddddddddddddddddddddddddddasdasdasdasdadasdasasdasdasdasdas",
    riskCategory: "High",
  },
];

const AuditReportPDF = ({ data }: any) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text>Reported Post</Text>
        <Text> DATE from March 3 to feb 2</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow} debug>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Email</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Title</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Focus</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Content</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Risk Category</Text>
            </View>
          </View>
          {/* Table Data */}
          {tableData.map((row: any, index: any) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{row.email}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{row.title.split(``)}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{row.focus}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableText}>{row.content.split(``)}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{row.riskCategory}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View>
        <ReactPDFChart>
          <BarChart width={500} height={300}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <Bar dataKey="uv" fill="#8884d8" isAnimationActive={false} />
            <Bar dataKey="pv" fill="#82ca9d" isAnimationActive={false} />
          </BarChart>
        </ReactPDFChart>
      </View>
    </Page>
  </Document>
);

interface Range {
  startDate: Date;
  endDate: Date;
  key: string;
}

const ExportData = () => {
  const { close } = isOpenExportData();
  const settings = isOpenSettings();
  const { data: session } = useSession();
  const [selectionRange, setSelectionRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [instance, update] = usePDF({ document: <AuditReportPDF /> });

  const handleSelect = (ranges: any) => {
    if (ranges) {
      setSelectionRange(ranges.selection);
    }
  };

  const getExportReports = async () => {
    try {
      const response = await axios.post("/api/export", {
        start: selectionRange.startDate.toISOString(),
        end: selectionRange.endDate.toISOString(),
      });

      const data = response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const { data, loading } = useRequest(getExportReports, {
    refreshDeps: [session, selectionRange],
  });

  console.log("start :", selectionRange.startDate);
  console.log("end :", selectionRange.endDate);
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-6"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-3xl font-semibold">
          Export Data
        </div>
        {/* <PDFViewer height="600" width="800">
          <AuditReportPDF />
        </PDFViewer> */}

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
            <a
              className="text-lg font-semibold rounded-lg px-2"
              style={{ backgroundColor: "#2D9054" }}
              href={instance.url as any}
              download={"exportedData.pdf"}
            >
              Confirm
            </a>
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
