"use client";

import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import DashboardHome from "../components/DashboardHome";
import LowRiskReports from "../components/LowRiskReports";
import {
  isOpenAddModerators,
  isOpenModerators,
  isOpenSettings,
} from "../lib/useStore";
import Settings from "../components/Overlays/Settings";
import Moderators from "../components/Overlays/Moderators";
import AddModerators from "../components/Overlays/AddModerators";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });
  const [selectedButton, setSelectedButton] = useState<string>("dashboard");

  const buttons = ["Dashboard", "High Risk Report", "Low Risk Report"];

  const renderComponent = () => {
    switch (selectedButton) {
      case "dashboard":
        return <DashboardHome />;

      case "low risk report":
        return <LowRiskReports />;

      case "high risk report":
        return "high risk";
    }
  };

  const settings = isOpenSettings();
  const mods = isOpenModerators();
  const addMods = isOpenAddModerators();
  return status === "loading" ? (
    <div className="flex items-center justify-center w-full min-h-screen gap-4">
      <span className="loading loading-spinner w-20 "></span>Verifying User
    </div>
  ) : (
    <>
      {settings.value && <Settings />}
      {mods.value && <Moderators />}
      {addMods.value && <AddModerators />}
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
                  className={`text-2xl font-semibold hover:bg-slate-400 hover:text-white duration-700 ${item === selectedButton && "bg-slate-400"}`}
                  onClick={() => {
                    setSelectedButton(item.toLowerCase());
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center flex-col gap-2">
            <button
              type="button"
              className="bg-gray-400 w-32 px-5 rounded-xl text-xl"
              onClick={settings.open}
            >
              Settings
            </button>
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
          className={`w-4/5 ${selectedButton === "dashboard" ? "bg-pink-100" : "bg-white"} min-h-screen flex flex-col`}
        >
          {renderComponent()}
        </div>
      </div>
    </>
  );
};

export default Page;
