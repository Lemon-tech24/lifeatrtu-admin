import { isOpenBanUsers, isOpenSettings } from "@/app/lib/useStore";
import { useRequest } from "ahooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiUserRemove } from "react-icons/hi";

const BanUsers = () => {
  const [keyword, setKeyword] = useState<boolean>(false);
  const settings = isOpenSettings();
  const banUsers = isOpenBanUsers();
  const { data: session } = useSession();

  const getBanUsers = async () => {
    try {
      const response = await axios.post("/api/ban/get");
      const data = response.data;

      if (data.ok) {
        return data.users;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const { data, loading } = useRequest(getBanUsers, {
    refreshDeps: [session, keyword],
  });

  const unBanUser = async (id: string, userId: string) => {
    const loadingId = toast.loading("Unbanning User...");
    try {
      const response = await axios.post("/api/unban", {
        id: id,
        userId: userId,
      });
      const data = response.data;

      if (data.ok) {
        toast.dismiss(loadingId);
        toast.success("User Unbanned");
      } else {
        toast.dismiss(loadingId);
        toast.error("Error Occured While Unbanning User");
      }
    } catch (err) {
      console.error(err);
    }

    setKeyword(!keyword);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-8"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="uppercase w-full flex items-center justify-center text-3xl font-semibold">
          Banned Users
        </div>

        <div className="relative w-full h-[420px]">
          {loading && (
            <span className="loading loading-dots w-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
          )}
          <div className="w-full h-full overflow-y-auto">
            {!loading ? (
              data && data.length > 0 ? (
                data.map(({ id, reason, email, userId, period }: any) => (
                  <div
                    key={id}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="w-full flex gap-2">
                      <button
                        type="button"
                        className="text-4xl flex items-center"
                        disabled={loading}
                        aria-disabled={loading}
                        onClick={() => unBanUser(id, userId)}
                      >
                        <HiUserRemove />
                      </button>
                      <div className="text-xl flex items-center">{email}</div>
                    </div>
                    <div className="w-full flex items-center justify-end pr-8 text-xl">
                      {reason} - {period}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-lg">Empty</div>
              )
            ) : null}
          </div>
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
