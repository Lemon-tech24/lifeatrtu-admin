import { isOpenBanUsers, isOpenSettings } from "@/app/lib/useStore";
import React from "react";

const BanUsers = () => {
  const settings = isOpenSettings();
  const banUsers = isOpenBanUsers();
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-8"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="uppercase w-full flex items-center justify-center text-3xl font-semibold">
          Banned Users
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            className="text-xl px-4 rounded-xl text-black"
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={() => {
              banUsers.close();
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

export default BanUsers;
