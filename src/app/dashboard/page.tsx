"use client";

import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import DashboardHome from "../components/DashboardHome";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const buttons = [
    "Dashboard",
    "Guidance Report",
    "High Risk Report",
    "Low Risk Report",
  ];

  return status === "loading" ? (
    "LOADING"
  ) : (
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
            className="font-extrabold text-center bg-clip-text text-transparent text-9xl"
          >
            RTU
          </div>
        </div>

        <div className="flex flex-col gap-16">
          {buttons.map((item: any, key: any) => {
            return (
              <button
                key={key}
                className="text-2xl font-semibold hover:bg-slate-400 hover:text-white duration-700"
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
          <button
            type="button"
            className="bg-red-500 px-4 rounded-xl text-xl"
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

      <div className="w-4/5 bg-pink-100 min-h-screen flex flex-col">
        <DashboardHome />
      </div>
    </div>
  );
};

export default Page;
