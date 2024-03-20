import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { isOpenBanAccount } from "../lib/useStore";

const BanAccount = () => {
  const [reason, setReason] = useState<string>("");
  const ban = isOpenBanAccount();
  const reference = useRef<HTMLFormElement>(null);
  const [banPeriod, setBanPeriod] = useState<string>("1day");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const controller = new AbortController();
    const loadingId = toast.loading("Banning User...");
    try {
      if (
        (reason !== "" || reason !== null || reason !== undefined) &&
        (ban.email !== "" || ban.email !== null || ban.email !== undefined)
      ) {
        const response = await axios.post("/api/ban", {
          userId: ban.userId,
          reason: reason,
          email: ban.email,
          period: banPeriod,
          signal: controller.signal,
        });

        const data = response.data;

        if (data.ok) {
          toast.dismiss(loadingId);
          toast.success(data.msg);
          ban.setEmail("");
          ban.setUserId("");
          ban.close();
        } else {
          toast.dismiss(loadingId);
          toast.error(data.msg);
        }
      } else {
        console.error("ERROR");
        toast.dismiss(loadingId);
        toast.error("ERROR");
      }

      return controller.abort();
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingId);
      toast.error("ERROR");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        style={{ backgroundColor: "#D9D9D9" }}
        className="w-6/12 rounded-xl flex flex-col gap-16 p-8"
      >
        <div className="flex w-full items-center justify-center font-bold text-3xl italic">
          Ban the user
        </div>

        <div className="w-full flex items-center justify-center">
          <p className="text-2xl">Are you sure you want this user? </p>
        </div>

        <form
          ref={reference}
          onSubmit={handleSubmit}
          className="flex w-full items-center justify-center flex-col gap-10"
        >
          <div className="flex items-center justify-center gap-2 w-3/6">
            <p className="text-xl w-24">Reason:</p>
            <input
              type="text"
              className="text-xl px-4 rounded-xl py-1 w-96"
              placeholder="Type Here..."
              autoComplete="off"
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-start gap-2 w-3/6">
            <p className="text-xl w-52">Period of Ban:</p>
            <select
              onChange={(e) => setBanPeriod(e.target.value)}
              className="text-xl px-4 rounded-xl w-full text-center py-1"
              required
            >
              <option value="1day">1 Day</option>
              <option value="3days">3 Days</option>
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>

          <div className="w-full flex items-center justify-center gap-20 mt-10">
            <button
              type="submit"
              className="bg-[#2D9054] text-white shadow-sm rounded-lg px-4 py-2 text-lg"
            >
              Confirm
            </button>
            <button
              type="button"
              className="bg-[#D73939] text-white shadow-sm rounded-lg px-4 py-2 text-lg"
              onClick={() => {
                ban.setUserId("");
                ban.setEmail("");
                ban.close();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BanAccount;
