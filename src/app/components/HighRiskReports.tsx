/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useInfiniteScroll } from "ahooks";
import { useSession } from "next-auth/react";

import Skeleton from "./UI/Skeleton";
import { CgProfile } from "react-icons/cg";
import moment from "moment";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  isMarkAsDone,
  isOpenBanAccount,
  isOpenImage,
  isOpenReport,
  isOpenUpdates,
} from "../lib/useStore";
import { IoIosWarning } from "react-icons/io";
import { FaCommentAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const HighRiskReports = () => {
  const { data: session } = useSession();
  const [select, setSelect] = useState<string>("most");
  const reference = useRef<HTMLDivElement>(null);

  const image = isOpenImage();
  const report = isOpenReport();
  const update = isOpenUpdates();
  const markDone = isMarkAsDone();
  const ban = isOpenBanAccount();

  const getPosts = async (skip: any, take: number) => {
    try {
      const response = await axios.post("/api/reports/read/high", {
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

  const MarkDelete = async (postId: any) => {
    const controller = new AbortController();
    try {
      const response = await axios.post("/api/delete", {
        postId: postId,
        signal: controller.signal,
      });

      const data = response.data;

      if (data.ok) {
        toast.success("Successfully Deleted");
        reload();
      } else toast.error("Failed to Delete");

      return controller.abort();
    } catch (err) {
      console.error(err);
      toast.error("ERROR");
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-end p-6">
        <select
          className="rounded-xl px-2 text-xl border border-black border-solid shadow-lg"
          onChange={(e) => setSelect(e.target.value)}
          defaultValue={"most"}
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
            <ResponsiveMasonry>
              <Masonry gutter="20px">
                {data &&
                  data.list &&
                  data.list.map((item: any, key: any) => {
                    return (
                      item && (
                        <div
                          key={key}
                          className="p-2 pl-4 rounded-xl bg-slate-300 shadow-lg"
                        >
                          {/* ----------------------------------------------------------------- */}
                          <div className="flex items-center justify-end">
                            {session?.user.role === "mod" ? (
                              !item.pending ? (
                                <button className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black">
                                  Request to Delete
                                </button>
                              ) : (
                                <></>
                              )
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                                  onClick={() => {
                                    markDone.setPostId(item.id);
                                    if (item.id === markDone.postId) {
                                      MarkDelete(markDone.postId);
                                    }
                                  }}
                                >
                                  Mark as Done
                                </button>
                                <button
                                  type="button"
                                  className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                                  onClick={() => {
                                    ban.setUserId(item.user.id);
                                    ban.setEmail(item.user.email);
                                    ban.open();
                                  }}
                                >
                                  Ban
                                </button>
                              </div>
                            )}
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
                          <div className="">
                            {moment(item.createdAt).format("LLL")}
                          </div>
                          {/* ----------------------------------------------------------------- */}

                          <div className="flex items-center gap-2">
                            <div className="text-4xl">
                              <CgProfile />
                            </div>

                            <div className="text-xl font-semibold">
                              {session?.user.role === "mod"
                                ? item.anonymous && "Anonymous"
                                : item.user.name}
                            </div>
                          </div>
                          {/* ----------------------------------------------------------------- */}

                          <div className="text-lg break-words text-justify w-full">
                            {item.content}
                          </div>
                          {/* ----------------------------------------------------------------- */}
                          {item.image && (
                            <div>
                              <img
                                src={item.image}
                                alt="Post Image"
                                className="cursor-pointer"
                                onClick={() => {
                                  image.source(item.image);
                                  image.open();
                                }}
                              />
                            </div>
                          )}
                          {/* ----------------------------------------------------------------- */}
                          <div className="flex w-full items-center justify-center gap-10 mt-8">
                            <div
                              className="flex items-center justify-center gap-1 cursor-pointer"
                              onClick={() => {
                                report.setData(item);
                                report.open();
                              }}
                            >
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

                            <button
                              type="button"
                              className={`flex items-center justify-center gap-1 `}
                              onClick={() => {
                                update.setPostId(item.id);
                                update.open();
                              }}
                            >
                              <div className="text-4xl">
                                <FaCommentAlt />
                              </div>
                              <div className="text-base font-semibold -mb-2">
                                Updates
                              </div>
                            </button>
                          </div>
                        </div>
                      )
                    );
                  })}

                {!loading && !loadingMore && noMore ? (
                  <div className="w-full h-full flex items-center justify-center font-semibold opacity-75">
                    <div className="bg-white rounded-lg px-2 text-xl flex items-center">
                      Nothing to Load
                    </div>
                  </div>
                ) : (
                  <Skeleton />
                )}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        )}
      </div>
    </>
  );
};

export default HighRiskReports;
