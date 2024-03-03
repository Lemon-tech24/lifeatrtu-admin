/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useInfiniteScroll, useRequest } from "ahooks";
import { useSession } from "next-auth/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { CgProfile } from "react-icons/cg";
import { IoIosWarning } from "react-icons/io";

import { FaCommentAlt } from "react-icons/fa";

const LowRiskReports = () => {
  const { data: session } = useSession();

  const reference = useRef<HTMLDivElement>(null);
  const getPosts = async (skip: any, take: number) => {
    try {
      const response = await axios.post("/api/reports/read/low", {
        skip: skip,
        take: take,
      });

      const data = response.data;
      const newSkip = skip + take;

      if (status.includes(data)) {
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
      reloadDeps: [session],
    }
  );

  return (
    <>
      <div className="w-full flex items-center justify-end p-2 ">
        <select className="bg-slate-300 rounded-xl px-2">
          <option value="">Most Low Risk</option>
          <option value="">Least Low Risk</option>
        </select>
      </div>
      <div className="w-full h-full px-6" ref={reference}>
        <ResponsiveMasonry>
          <Masonry gutter="20px">
            {!loading &&
              data &&
              data.list &&
              data.list.length > 0 &&
              data.list.map((item: any, key: any) => {
                return (
                  item && (
                    <div
                      key={key}
                      className="p-2 pl-4 rounded-xl bg-slate-300 shadow-lg animate-fadeIn"
                    >
                      {/* ----------------------------------------------------------------- */}
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                        >
                          Mark as Done
                        </button>
                      </div>
                      {/* ----------------------------------------------------------------- */}
                      <div className="font-bold text-2xl">{item.title}</div>
                      {/* ----------------------------------------------------------------- */}
                      <div className="flex gap-2 text-2xl uppercase font-bold">
                        Focus:
                        <div className="font-normal text-xl flex items-center justify-center">
                          {item.focus}
                        </div>
                      </div>
                      {/* ----------------------------------------------------------------- */}

                      <div className="flex items-center gap-2">
                        <div className="text-4xl">
                          <CgProfile />
                        </div>

                        <div className="text-xl font-semibold">
                          {item.user.name}
                        </div>
                      </div>
                      {/* ----------------------------------------------------------------- */}

                      <div className="text-lg break-words text-justify w-full">
                        {item.content}
                      </div>
                      {/* ----------------------------------------------------------------- */}
                      {item.image && <div>With image</div>}
                      {/* ----------------------------------------------------------------- */}
                      <div className="flex w-full items-center justify-center gap-10 mt-8">
                        <div className="flex items-center justify-center gap-1">
                          <div className="text-4xl">
                            <IoIosWarning />
                          </div>
                          <div
                            className="text-base font-semibold -mb-3"
                            style={{ color: "#CA0C0C" }}
                          >
                            {item._count.reports} REPORTS
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1">
                          <div className="text-2xl">
                            <FaCommentAlt />
                          </div>
                          <div className="text-base font-semibold -mb-3">
                            Comments
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </>
  );
};

export default LowRiskReports;
