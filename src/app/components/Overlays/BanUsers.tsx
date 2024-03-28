/* eslint-disable react-hooks/exhaustive-deps */

import { formatTimeDays } from "@/app/lib/FormatTime";
import { isOpenBanUsers, isOpenSettings } from "@/app/lib/useStore";
import { useRequest } from "ahooks";
import axios from "axios";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiUserRemove } from "react-icons/hi";

const BanUsers = () => {
  const [keyword, setKeyword] = useState<boolean>(false);
  const settings = isOpenSettings();
  const banUsers = isOpenBanUsers();
  const { data: session } = useSession();

  const [disabled, setDisabled] = useState<boolean>(false);
  const [disabledBTN, setDisabledBTN] = useState<boolean>(false);

  const controllerRef = useRef<AbortController>(new AbortController());

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

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

  const unBanUser = (id: string, userId: string) => {
    const loadingId = toast.loading("Unbanning User...");

    const { signal } = controllerRef.current;

    if (disabled) {
      toast.error("Please Wait");
    }

    setDisabled(true);
    setTimeout(() => {
      setDisabledBTN(true);
      axios
        .post("/api/unban", { id: id, userId: userId }, { signal: signal })
        .then((response) => {
          const data = response.data;

          if (data.ok) {
            toast.success("User Unbanned");
            setKeyword(!keyword);
          } else {
            toast.error("Error Occurred While Unbanning User.");
          }
        })
        .catch((err) => {
          if (err.name === "CanceledError") {
            toast.error("Canceled");
          }
        })
        .finally(() => {
          toast.dismiss(loadingId);
          setDisabled(false);
          setDisabledBTN(false);
        });
    }, 500);
  };

  const reset = (id: any, userId: any) => {
    axios.post("/api/unban", { id: id, userId: userId }).catch((err: any) => {
      console.error(err);
    });
  };

  const formatDate = (updateAt: any, days: any, id: any, userId: any) => {
    const startDate = new Date(updateAt);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days);

    const endDateISOString = endDate.toISOString();
    const isEndDateToday = isToday(endDate);

    if (isEndDateToday) {
      reset(id, userId);
    }

    return endDateISOString;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-8/12 rounded-xl flex flex-col gap-10 p-8"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="uppercase w-full flex items-center justify-center text-3xl font-semibold">
          Banned Users
        </div>

        <div className="relative w-full h-[600px] overflow-y-auto">
          {loading && (
            <span className="loading loading-dots w-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
          )}
          <div className="w-full">
            {!loading && data && data.length > 0 ? (
              <table className="w-full h-full border-collapse shadow-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-4 text-center align-middle">Unban</th>
                    <th className="py-4 text-center align-middle">Email</th>
                    <th className="py-4 text-center align-middle">Reason</th>
                    <th className="py-4 text-center align-middle">
                      Ban Period
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(
                    ({
                      id,
                      reason,
                      email,
                      userId,
                      periodTime,
                      days,
                      permanent,
                      createdAt,
                      updatedAt,
                    }: any) => (
                      <tr key={id} className="bg-white">
                        <td className="text-center py-4">
                          <button
                            type="button"
                            className="text-4xl text-red-600 hover:text-red-700 focus:outline-none"
                            disabled={loading || disabled || disabledBTN}
                            onClick={() => unBanUser(id, userId)}
                          >
                            <HiUserRemove />
                          </button>
                        </td>
                        <td className="py-4 text-center">{email}</td>
                        <td className="py-4 text-center">{reason}</td>
                        <td className="text-center py-4">
                          {permanent ? (
                            <span className="text-green-600 font-semibold">
                              Permanent
                            </span>
                          ) : (
                            <>
                              <div className="font-semibold">From</div>
                              {moment(createdAt).format("lll")}
                              <div className="font-semibold">To</div>
                              {moment(
                                formatDate(updatedAt, days, id, userId)
                              ).format("lll")}
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <div className="text-lg text-center">
                {loading ? "" : "Empty"}
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            className={`text-xl px-4 rounded-xl text-black ${disabledBTN && "hidden"}`}
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={() => {
              controllerRef.current.abort();
              banUsers.close();
              settings.open();
            }}
            disabled={disabled || disabledBTN}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanUsers;
