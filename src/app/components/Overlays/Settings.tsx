import {
  isOpenAddModerators,
  isOpenBanUsers,
  isOpenExportData,
  isOpenModerators,
  isOpenSettings,
} from "@/app/lib/useStore";
import React from "react";

const Settings = () => {
  const settings = isOpenSettings();
  const mods = isOpenModerators();
  const addMods = isOpenAddModerators();
  const exportData = isOpenExportData();
  const banUsers = isOpenBanUsers();
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-8 xl:w-8/12 md:w-11/12 sm:w-full sm:h-full sm:justify-center sm:rounded-none"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="flex w-full items-center justify-center uppercase text-3xl font-semibold">
          Settings
        </div>
        {/* ------------------------------------------------------ */}
        <button
          type="button"
          className="w-full bg-white p-2 rounded-lg text-2xl md:text-xl"
          onClick={() => {
            settings.close();
            mods.open();
          }}
        >
          Moderators
        </button>

        {/* ------------------------------------------------------ */}
        <button
          type="button"
          className="w-full bg-white p-2 rounded-lg text-2xl md:text-xl"
          onClick={() => {
            settings.close();
            addMods.open();
          }}
        >
          Add Moderators
        </button>
        {/* ------------------------------------------------------ */}
        <button
          type="button"
          className="w-full bg-white p-2 rounded-lg text-2xl md:text-xl"
          onClick={() => {
            settings.close();
            exportData.open();
          }}
        >
          Export Data
        </button>
        {/* ------------------------------------------------------ */}
        <button
          type="button"
          className="w-full bg-white p-2 rounded-lg text-2xl md:text-xl"
          onClick={() => {
            settings.close();
            banUsers.open();
          }}
        >
          Banned Users
        </button>
        {/* ------------------------------------------------------ */}
        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            className="text-xl px-4 rounded-xl text-black md:text-lg"
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={settings.close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
