import React from "react";

const Skeleton = () => {
  return (
    <div className="p-2 rounded-xl bg-slate-400/90 shadow-sm opacity-25">
      <div className="flex w-full items-center justify-end">
        <div className="skeleton h-4 w-6"></div>
      </div>

      <div className="flex flex-col items-start justify-center gap-2">
        <div className="skeleton h-6 w-28"></div>
        <div className="skeleton h-3 w-16"></div>
        <div className="skeleton h-3 w-16"></div>
        <div
          className="skeleton h-44 w-full"
          style={{
            minWidth: "100%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Skeleton;
