import { isOpenModerators, isOpenSettings } from "@/app/lib/useStore";
import React from "react";

const Moderators = () => {
  const mods = isOpenModerators();
  const settings = isOpenSettings();
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-8"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-2xl font-semibold">
          Moderators
        </div>

        <div>NAMES HERE</div>

        <div className="w-full flex items-center justify-center">
          <button
            className="text-xl px-4 rounded-xl text-black"
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={() => {
              mods.close();
              settings.open();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Moderators;
