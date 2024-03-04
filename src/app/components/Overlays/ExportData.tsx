import { isOpenExportData } from "@/app/lib/useStore";
import React from "react";

const ExportData = () => {
  const { close } = isOpenExportData();

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-6"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-3xl font-semibold">
          Export Data
        </div>

        <div className="w-full flex items-center justify-center flex-col px-10 gap-4">
          <div className="flex items-center justify-start w-full gap-2">
            <input type="radio" name="low" id="" className="h-6 w-6" />
            <p className="text-2xl">High Risk Report</p>
          </div>

          <div className="flex items-center justify-start w-full gap-2">
            <input type="radio" name="low" id="" className="h-6 w-6" />
            <p className="text-2xl">Low Risk Report</p>
          </div>

          <div className="flex items-center justify-start w-full gap-2">
            <input type="radio" name="high" className="h-6 w-6" />
            <p className="text-2xl">Custom Range</p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-4 mt-4">
          <button
            className="text-lg font-semibold rounded-lg px-2"
            style={{ backgroundColor: "#2D9054" }}
            type="submit"
          >
            Confirm
          </button>
          <button
            className="text-lg font-semibold rounded-lg px-2"
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={close}
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
