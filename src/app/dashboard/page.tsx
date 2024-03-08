/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import DashboardHome from "../components/DashboardHome";
import LowRiskReports from "../components/LowRiskReports";
import {
  isOpenAddModerators,
  isOpenExportData,
  isOpenImage,
  isOpenModerators,
  isOpenReport,
  isOpenSettings,
  isOpenUpdates,
} from "../lib/useStore";
import Settings from "../components/Overlays/Settings";
import Moderators from "../components/Overlays/Moderators";
import AddModerators from "../components/Overlays/AddModerators";
import ExportData from "../components/Overlays/ExportData";
import Updates from "../components/Overlays/Updates";
import ImagePost from "../components/Overlays/ImagePost";
import Reports from "../components/Overlays/Reports";
import PendingDelete from "../components/PendingDelete";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [selectedButton, setSelectedButton] = useState<string>(
    session?.user.role === "mod" ? "high risk report" : "dashboard"
  );

  const buttons =
    session?.user?.role === "mod"
      ? ["High Risk Report", "Low Risk Report"]
      : [
          "Dashboard",
          "High Risk Report",
          "Low Risk Report",
          "Pending to Delete",
        ];

  const renderComponent = () => {
    switch (selectedButton) {
      case "dashboard":
        return <DashboardHome />;

      case "low risk report":
        return <LowRiskReports />;

      case "high risk report":
        return "high risk";

      case "pending to delete":
        return <PendingDelete />;
    }
  };

  const settings = isOpenSettings();
  const mods = isOpenModerators();
  const addMods = isOpenAddModerators();
  const exportData = isOpenExportData();
  const updates = isOpenUpdates();
  const image = isOpenImage();
  const report = isOpenReport();

  return status === "loading" ? (
    <div className="flex items-center justify-center w-full min-h-screen gap-4">
      <span className="loading loading-spinner w-20 "></span>Verifying User
    </div>
  ) : (
    <>
      {settings.value && <Settings />}
      {mods.value && <Moderators />}
      {addMods.value && <AddModerators />}
      {exportData.value && <ExportData />}
      {updates.value && <Updates />}
      {image.value && <ImagePost />}
      {report.value && <Reports />}

      <div className="flex">
        <div className="relative w-1/5 bg-slate-300 min-h-screen">
          <div className="flex items-center justify-center gap-1 my-28">
            <div
              className="text-4xl  rounded-2xl px-2 pl- pr-0 flex items-center justify-center leading-normal"
              style={{ letterSpacing: "0.2em" }}
            >
              Life@
            </div>
            <div
              style={{
                backgroundImage: "url('/textbg.png')",
                backgroundSize: "cover",
              }}
              className="font-extrabold text-center bg-clip-text text-transparent text-8xl"
            >
              RTU
            </div>
          </div>

          <div className="flex flex-col gap-16">
            {buttons.map((item: any, key: any) => {
              return (
                <button
                  key={key}
                  className={`text-2xl font-semibold hover:bg-slate-400 hover:text-white duration-700 ${item.toLowerCase() === selectedButton && "bg-slate-400 text-white"}`}
                  onClick={() => {
                    setSelectedButton(item.toLowerCase());
                  }}
                  disabled={status !== "authenticated" ? true : false}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center flex-col gap-2">
            {session.user.role !== "mod" && (
              <button
                type="button"
                className="bg-gray-400 w-32 px-5 rounded-xl text-xl"
                onClick={settings.open}
              >
                Settings
              </button>
            )}
            <button
              type="button"
              className="bg-red-500 w-32 px-5 rounded-xl text-xl"
              onClick={() =>
                signOut({ redirect: false }).then(() => {
                  router.push("/");
                })
              }
            >
              Logout
            </button>
          </div>
        </div>

        <div
          className={`relative w-4/5 min-h-screen flex flex-col`}
          style={{
            backgroundImage:
              selectedButton === "low risk report" ||
              selectedButton === "high risk report"
                ? `url("/bg.png")`
                : ``,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {renderComponent()}
        </div>
      </div>
    </>
  );
};

export default Page;
