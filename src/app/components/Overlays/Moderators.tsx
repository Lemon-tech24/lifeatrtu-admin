import { isOpenModerators, isOpenSettings } from "@/app/lib/useStore";
import { useRequest } from "ahooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import bcrypt from "bcrypt";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

const Moderators = () => {
  const mods = isOpenModerators();
  const settings = isOpenSettings();
  const { data: session } = useSession();
  const [keyword, setKeyword] = useState<boolean>(false);

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
    refreshDeps: [session, keyword],
  });

  const deleteMod = async (id: string) => {
    const loadingId = toast.loading("Deleting Moderator...");
    try {
      const response = await axios.post("/api/moderator/delete", {
        id: id,
      });

      const data = response.data;

      if (data.ok) {
        toast.dismiss(loadingId);
        toast.success("Removed as Moderator");
      } else {
        toast.dismiss(loadingId);
        toast.error("Error occured");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingId);
    }

    setKeyword(!keyword);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col px-12 p-4"
        style={{ backgroundColor: "#D9D9D9", maxHeight: "80vh" }}
      >
        <div className="flex items-center justify-center uppercase text-3xl font-semibold mb-4">
          Moderators
        </div>
        <div className="flex items-center text-base font-semibold mb-2">
          {loading ? (
            <span className="loading loading-dots flex items-center"></span>
          ) : (
            data.length
          )}
          /10 Moderators
        </div>
        {loading ? (
          <div className="w-full flex items-center justify-center mb-4">
            <div className="loading loading-dots w-14"></div>
          </div>
        ) : (
          <div className="w-full overflow-auto">
            {data &&
              data.map((item: any, key: any) => {
                return (
                  <div
                    key={key}
                    className="flex justify-center items-start mb-2"
                  >
                    <div className="w-full">
                      <div className="text-xl font-semibold">
                        {item.username}
                      </div>
                      <div className="text-xl">
                        {item.role === "mod" && "Moderator"}
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-end">
                      <button
                        type="button"
                        className="text-2xl text-red-500"
                        onClick={() => deleteMod(item.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
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
