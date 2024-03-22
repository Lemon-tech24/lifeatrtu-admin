"use client";

import { isOpenUpdates } from "@/app/lib/useStore";
import { useRequest } from "ahooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Updates = () => {
  const { data: session, status } = useSession();
  const [comment, setComment] = useState<string>("");
  const [keyword, setKeyword] = useState<boolean>(false);
  const updates = isOpenUpdates();
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const loadingId = toast.loading("Loading");
      const response = await axios.post("/api/update", {
        comment: comment,
        postId: updates.postId,
      });

      const data = response.data;

      if (data.ok) {
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }

      toast.dismiss(loadingId);
    } catch (err) {
      console.error();

      toast.error("ERROR");
    }
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
    refreshDeps: [session],
  });

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="relative w-7/12 rounded-xl flex flex-col gap-10 p-4 h-[90%]"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <button
          className="absolute top-2 right-4 rounded-md px-1 text-base font-semibold"
          style={{ backgroundColor: "#FF3F3F" }}
          onClick={updates.close}
        >
          Close
        </button>
        <div className="w-full text-center text-3xl uppercase font-bold">
          Updates
        </div>
        <div className="w-full overflow-auto flex gap-2 flex-col items-center px-16">
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
          className="w-full flex flex-col justify-center px-16"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Post an update"
            name="comment"
            className={`p-4 rounded-xl text-xl ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
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
