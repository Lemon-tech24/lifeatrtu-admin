import { isOpenAddModerators, isOpenSettings } from "@/app/lib/useStore";
import React from "react";

const AddModerators = () => {
  const addMods = isOpenAddModerators();
  const settings = isOpenSettings();
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-6"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-2xl font-semibold">
          Add Moderators
        </div>
        <form className="w-full flex flex-col gap-2 items-center">
          <div className="flex gap-12 w-10/12">
            <p className="w-24 text-2xl">Username: </p>
            <input
              type="text"
              name="username"
              className="w-full rounded-lg px-4 text-lg"
            />
          </div>

          <div className="flex gap-12 w-10/12">
            <p className="w-24 text-2xl">Password: </p>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg px-4 text-lg"
            />
          </div>

          <div className="w-10/12 flex items-center justify-end gap-4">
            <button
              className="text-lg font-semibold rounded-lg px-2"
              style={{ backgroundColor: "#2D9054" }}
            >
              Confirm
            </button>
            <button
              className="text-lg font-semibold rounded-lg px-2"
              style={{ backgroundColor: "#FF3F3F" }}
              onClick={() => {
                addMods.close();
                settings.open();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModerators;
