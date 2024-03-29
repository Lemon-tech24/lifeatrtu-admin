/* eslint-disable react-hooks/exhaustive-deps */
import { isOpenExportData, isOpenSettings } from "@/app/lib/useStore";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { PDFViewer, usePDF } from "@react-pdf/renderer";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRequest } from "ahooks";
import AuditReportPDF from "../AuditReportPDF";

const data = [
  { name: "A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "G", uv: 3490, pv: 4300, amt: 2100 },
];

const tableData = [
  {
    email: "user1@example.com",
    title: "Post 1",
    focus: "Focus 1",
    content:
      "asdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdsssssssssssssssssssssssssssssssssasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdaaaaassssssssssssssssssssssdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasda",
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

const ExportData = () => {
  const { close } = isOpenExportData();
  const settings = isOpenSettings();
  const { data: session } = useSession();
  const [selectionRange, setSelectionRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [instance, update] = usePDF({
    document: <AuditReportPDF data={tableData} />,
  });

  useEffect(() => {
    update(<AuditReportPDF data={tableData} />);
  }, [session]);

  const handleSelect = (ranges: any) => {
    if (ranges) {
      setSelectionRange(ranges.selection);
    }
  };

  // const getExportReports = async () => {
  //   try {
  //     const response = await axios.post("/api/export", {
  //       start: selectionRange.startDate.toISOString(),
  //       end: selectionRange.endDate.toISOString(),
  //     });

  //     const data = response.data;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const { data, loading } = useRequest(getExportReports, {
  //   refreshDeps: [session, selectionRange],
  // });

  // console.log("start :", selectionRange.startDate);
  // console.log("end :", selectionRange.endDate);
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-6"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-3xl font-semibold">
          Export Data
        </div>
        <PDFViewer height="600" width="800">
          <AuditReportPDF data={tableData} />
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
