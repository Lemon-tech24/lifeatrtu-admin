import { isOpenModerators, isOpenSettings } from "@/app/lib/useStore";
import { useRequest } from "ahooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import bcrypt from "bcrypt";

const Moderators = () => {
  const mods = isOpenModerators();
  const settings = isOpenSettings();
  const { data: session } = useSession();

  const getMods = async () => {
    const controller = new AbortController();
    try {
      const response = await axios.post("/api/moderator", {
        signal: controller.signal,
      });

      const data = response.data;

      if (data.ok) {
        return data.mods;
      }

      controller.abort();
    } catch (err) {
      console.error(err);
    }
  };

  const { data, loading } = useRequest(getMods, {
    refreshDeps: [session],
  });

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-8"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-3xl font-semibold">
          Moderators
        </div>

        {loading ? (
          <div className="w-full flex items-center justify-center">
            <div className="loading loading-dots w-14"></div>
          </div>
        ) : (
          data &&
          data.map((item: any, key: any) => {
            return (
              <div key={key}>
                <div className="text-xl font-semibold">
                  Usernames: {item.username}
                </div>
                <div className="text-xl">
                  Role: {item.role === "mod" && "Moderator"}
                </div>
              </div>
            );
          })
        )}
        <div className="w-full flex items-center justify-center">
          <button
            className="text-xl px-4 rounded-xl text-black"
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={() => {
              mods.close();
              settings.open();
            }}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Moderators;
