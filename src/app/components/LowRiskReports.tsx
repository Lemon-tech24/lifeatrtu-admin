/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteScroll } from "ahooks";
import { useSession } from "next-auth/react";
import LowPosts from "./LowPosts";
import Skeleton from "./UI/Skeleton";

const LowRiskReports = () => {
  const { data: session } = useSession();
  const [select, setSelect] = useState<string>("most");

  const reference = useRef<HTMLDivElement>(null);
  const getPosts = async (skip: any, take: number) => {
    try {
      const response = await axios.post("/api/reports/read/low", {
        skip: skip,
        take: take,
        order: select,
      });

      const data = response.data;
      const newSkip = skip + take;

      if (!data || data === null || data === undefined) {
        throw new Error("Failed to fetch posts: " + data);
      }

      return {
        list: data,
        skip: data && data.length < 10 ? undefined : newSkip,
      };
    } catch (err) {
      console.error("Error fetching posts:", err);
      throw err;
    }
  };

  const { data, loading, loadingMore, noMore } = useInfiniteScroll(
    (d) => getPosts(d?.skip ? d?.skip : 0, 10),
    {
      target: reference,
      isNoMore: (d) => d?.skip === undefined,
      reloadDeps: [session, select],
    }
  );

  return (
    <>
      <div className="w-full flex items-center justify-end p-6">
        <select
          className="bg-slate-300 rounded-xl px-2 text-xl border border-black border-solid shadow-lg"
          onChange={(e) => setSelect(e.target.value)}
          defaultValue={"most"}
        >
          <option value="most">Most Low Risk</option>
          <option value="least">Least Low Risk</option>
        </select>
      </div>

      <div className="w-full h-full px-6" ref={reference}>
        {loading || loadingMore ? <Skeleton /> : <LowPosts data={data} />}
      </div>
    </>
  );
};

export default LowRiskReports;
