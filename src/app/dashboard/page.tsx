/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import DashboardHome from "../components/DashboardHome";
import LowRiskReports from "../components/LowRiskReports";
import { IoMenu } from "react-icons/io5";
import { slide as Menu } from "react-burger-menu";
import {
  BanCountDown,
  isOpenAddModerators,
  isOpenBanAccount,
  isOpenBanUsers,
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
import HighRiskReports from "../components/HighRiskReports";
import BanAccount from "../components/BanAccount";
import BanUsers from "../components/Overlays/BanUsers";
import { CgClose } from "react-icons/cg";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [open, setOpen] = useState<boolean>(false);

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
        return <HighRiskReports />;

      case "pending to delete":
        return <PendingDelete />;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const settings = isOpenSettings();
  const mods = isOpenModerators();
  const addMods = isOpenAddModerators();
  const exportData = isOpenExportData();
  const updates = isOpenUpdates();
  const image = isOpenImage();
  const report = isOpenReport();
  const ban = isOpenBanAccount();
  const banUsers = isOpenBanUsers();

  const banTimer = BanCountDown();

  useEffect(() => {}, []);

  return status === "loading" ? (
    <div className="flex items-center justify-center w-full min-h-screen gap-4">
      <span className="loading loading-spinner w-20 "></span>Verifying User
    </div>
  ) : (
    <>
      <button
        className="absolute top-2 left-4 text-5xl hidden lg:block cursor-pointer z-10 sm:top-1 sm:left-2 sm:text-4xl"
        onClick={handleOpen}
      >
        <IoMenu />
      </button>
      {settings.value && <Settings />}
      {mods.value && <Moderators />}
      {addMods.value && <AddModerators />}
      {exportData.value && <ExportData />}
      {updates.value && <Updates />}
      {image.value && <ImagePost />}
      {report.value && <Reports />}
      {ban.value && <BanAccount />}
      {banUsers.value && <BanUsers />}

      <div className="flex">
        <Menu
          className="bg-slate-300 hidden lg:flex lg:items-center lg:justify-center"
          isOpen={open}
          onOpen={handleOpen}
          customBurgerIcon={false}
          onClose={handleClose}
          width={"100%"}
        >
          <div
            className="relative w-full h-full items-center justify-center flex-col gap-20"
            style={{ display: "flex" }}
          >
            <button
              onClick={handleClose}
              className=" text-2xl absolute top-2 right-2"
            >
              <CgClose />
            </button>
            {buttons.map((item: any, key: any) => {
              return (
                <button
                  key={key}
                  className={`w-full text-2xl font-semibold hover:bg-slate-400 hover:text-white duration-700 ${item.toLowerCase() === selectedButton && "bg-slate-400 text-white"}`}
                  onClick={() => {
                    handleClose();
                    setSelectedButton(item.toLowerCase());
                  }}
                  disabled={status !== "authenticated" ? true : false}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </Menu>
        <div className="relative w-1/5 bg-slate-300 min-h-screen lg:hidden">
          <div className="flex items-center justify-center gap-1 my-28 flex-wrap">
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
          className={`relative w-4/5 min-h-[97vh] flex flex-col lg:w-full`}
          style={{
            backgroundImage:
              selectedButton === "low risk report" ||
              selectedButton === "high risk report" ||
              selectedButton === "pending to delete"
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
