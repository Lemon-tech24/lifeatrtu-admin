import { isOpenUpdates } from "@/app/lib/useStore";
import React from "react";

const Updates = () => {
  const updates = isOpenUpdates();
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="relative w-7/12 rounded-xl flex flex-col gap-10 p-4 min-h-[66%]"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <button
          className="absolute top-2 right-4 rounded-md px-1 text-base font-semibold"
          style={{ backgroundColor: "#FF3F3F" }}
          onClick={updates.close}
        >
          Close
        </button>
        <div className="w-full text-center text-3xl uppercase font-bold">
          Updates
        </div>

        <div className="bg-white rounded-xl p-4 mx-16">
          <p className="text-2xl font-semibold">Moderator</p>
          <p className="pl-4">
            message message message message message message message
          </p>
        </div>
      </div>
    </div>
  );
};

export default Updates;
