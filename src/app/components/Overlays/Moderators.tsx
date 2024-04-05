import { isOpenModerators, isOpenSettings } from "@/app/lib/useStore";
import { useRequest } from "ahooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import bcrypt from "bcrypt";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

const Moderators = () => {
  const mods = isOpenModerators();
  const settings = isOpenSettings();
  const { data: session } = useSession();
  const [keyword, setKeyword] = useState<boolean>(false);
  const controllerRef = useRef<AbortController>(new AbortController());
  const [disable, setDisabled] = useState<boolean>(false);
  const [disableBTN, setDisabledBTN] = useState<boolean>(false);

  const getMods = async () => {
    try {
      const response = await axios.post("/api/moderator");

      const data = response.data;

      if (data.ok) {
        return data.mods;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const { data, loading } = useRequest(getMods, {
    refreshDeps: [session, keyword],
  });

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

  const deleteMod = async (id: string) => {
    const loadingId = toast.loading("Deleting Moderator...");

    const { signal } = controllerRef.current;

    if (disable) {
      toast.error("Please Wait");
    }

    setDisabled(true);

    setTimeout(() => {
      setDisabledBTN(true);
      axios
        .post(
          "/api/moderator/delete",
          {
            id: id,
          },
          { signal: signal }
        )
        .then((response) => {
          const data = response.data;
          if (data.ok) {
            toast.success("Removed as Moderator");
            setKeyword(!keyword);
          } else {
            toast.error("Failed To remove Moderator");
          }
        })
        .catch((err) => {
          if (err.name === "CanceledError") {
            toast.error("Canceled");
          }

          toast.error("Error Occured");
        })
        .finally(() => {
          toast.dismiss(loadingId);
          setDisabled(false);
          setDisabledBTN(false);
        });
    }, 500);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col px-12 p-4 xl:w-8/12 md:w-11/12 sm:w-[94%]"
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
                        disabled={disable || loading || disableBTN}
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
            className={`text-xl px-4 rounded-xl text-black xl:text-lg xl:px-2 sm:text-sm ${disableBTN && "hidden"}`}
            style={{ backgroundColor: "#FF3F3F" }}
            onClick={() => {
              controllerRef.current.abort();
              mods.close();
              settings.open();
            }}
            disabled={loading || disable || disableBTN}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Moderators;
