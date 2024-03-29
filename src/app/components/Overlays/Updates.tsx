import { isOpenUpdates } from "@/app/lib/useStore";
import { useRequest, useDebounceFn } from "ahooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Updates = () => {
  const { data: session, status } = useSession();
  const [comment, setComment] = useState<string>("");
  const [keyword, setKeyword] = useState<boolean>(false);
  const updates = isOpenUpdates();
  const controllerRef = useRef(new AbortController());
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const loadingId = toast.loading("Loading");

    const { signal } = controllerRef.current;

    setTimeout(async () => {
      setDisabled(true);
      axios
        .post(
          "/api/update",
          {
            comment: comment,
            postId: updates.postId,
          },
          { signal: signal }
        )
        .then((response) => {
          if (response.data.ok) {
            toast.success(response.data.msg);
          } else {
            toast.error(response.data.msg);
          }
        })
        .catch((err) => {
          if (err.name === "CanceledError") {
            toast.error("Canceled");
          }
        })
        .finally(() => {
          toast.dismiss(loadingId);
          setComment("");
          setKeyword(!keyword);
          setDisabled(false);
        });
    }, 1000);
  };

  const getUpdates = async () => {
    try {
      const response = await axios.post("/api/update/get", {
        postId: updates.postId,
      });

      const data = response.data;

      if (data) {
        return data.updates;
      }
      return data;
    } catch (err) {
      console.error();
    }
  };

  const { data, loading } = useRequest(getUpdates, {
    refreshDeps: [session, keyword],
  });

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="relative w-7/12 rounded-xl flex flex-col gap-10 p-4 h-[90%] lg:w-10/12 sm:w-full sm:h-full sm:rounded-none"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <button
          className={`absolute top-2 right-4 rounded-md px-1 text-base font-semibold ${disabled && "hidden"}`}
          style={{ backgroundColor: "#FF3F3F" }}
          onClick={() => {
            controllerRef.current.abort();
            updates.close();
          }}
        >
          Close
        </button>
        <div className="w-full text-center text-3xl uppercase font-bold">
          Updates
        </div>
        <div className="w-full overflow-y-auto flex gap-2 flex-col items-center px-16 lg:px-10 sm:px-4">
          {loading ? (
            <div className="loading loading-dots w-16"></div>
          ) : data && data.updates.length > 0 ? (
            data.updates.map((item: any, key: number) => {
              return (
                <div className="bg-white rounded-xl p-4 w-full" key={key}>
                  <p className="text-2xl font-semibold">{item.author}</p>
                  <p className="pl-4 text-base text-justify">{item.comment}</p>
                </div>
              );
            })
          ) : (
            <p className="text-base font-semibold">Empty</p>
          )}
        </div>

        <form
          className="w-full flex flex-col justify-center px-16 lg:px-10 sm:px-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Post an update"
            name="comment"
            className={`p-4 rounded-xl text-xl ${loading ? "cursor-not-allowed" : "cursor-pointer"} md:text-lg`}
            onChange={(e) => setComment(e.target.value)}
            required
            disabled={loading ? true : false}
            autoComplete="off"
            aria-disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default Updates;
