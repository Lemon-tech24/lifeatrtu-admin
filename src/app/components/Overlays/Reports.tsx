import { isOpenReport } from "@/app/lib/useStore";
import React from "react";

const Reports = () => {
  const reports = isOpenReport();

  const reportCounts: any = {};
  reports.data.reports.forEach((report: any) => {
    if (report.reason in reportCounts) {
      reportCounts[report.reason]++;
    } else {
      reportCounts[report.reason] = 1;
    }
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col px-12 p-4"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="uppercase w-full flex items-center justify-center text-3xl font-semibold">
          Reports
        </div>

        {Object.entries(reportCounts).map(([reason, count]) => (
          <div
            key={reason}
            className="text-xl first-letter:uppercase"
          >{`${reason}: ${count}`}</div>
        ))}

        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            className="text-base w-16 rounded-xl font-semibold"
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={() => {
              reports.clearData();
              reports.close();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
