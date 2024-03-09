/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteScroll } from "ahooks";
import { useSession } from "next-auth/react";
import LowPosts from "./LowPosts";

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

      if (!data || data === null || data === undefined) {
        throw new Error("Failed to fetch posts: " + data);
      }
      const newSkip = data.length < take ? undefined : skip + take;

      return {
        list: data,
        skip: newSkip,
      };
    } catch (err) {
      console.error("Error fetching posts:", err);
      throw err;
    }
  };

  const { data, loading, loadingMore, mutate, noMore, reload } =
    useInfiniteScroll((d) => getPosts(d?.skip ? d?.skip : 0, 10), {
      target: reference,
      isNoMore: (d) => d?.skip === undefined,
      reloadDeps: [session, select],
    });

  return (
    <>
      <div className="w-full flex items-center justify-end p-6">
        <select
          className="rounded-xl px-2 text-xl border border-black border-solid shadow-lg"
          onChange={(e) => setSelect(e.target.value)}
          defaultValue={"most"}
          disabled={loading || loadingMore}
        >
          <option value="most">Most Report</option>
          <option value="least">Least Report</option>
        </select>
      </div>

      <div className="relative w-full h-full px-6" ref={reference}>
        {!loading && !loadingMore && data && data.list.length === 0 ? (
          <div className="text-2xl font-semibold">No Reports</div>
        ) : (
          <div className="w-full overflow-y-auto">
            <LowPosts
              data={data}
              mutate={mutate}
              loading={loading}
              loadingMore={loadingMore}
              noMore={noMore}
              reload={reload}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LowRiskReports;
