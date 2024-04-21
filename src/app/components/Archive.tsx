/* eslint-disable @next/next/no-img-element */
import { useInfiniteScroll } from "ahooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import {
  DisregardReport,
  isMarkAsDone,
  isOpenBanAccount,
  isOpenImage,
  isOpenReport,
  isOpenUpdates,
  useCategorize,
  useMultipleSelect,
} from "../lib/useStore";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import toast from "react-hot-toast";
import { FaCommentAlt } from "react-icons/fa";
import Skeleton from "./UI/Skeleton";
import { IoIosWarning } from "react-icons/io";
import { BsIncognito } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import moment from "moment";
import Categorize from "./Overlays/Categorize";

const Archive = () => {
  const [select, setSelect] = useState<string>("most");

  const { data: session } = useSession();
  const reference = useRef<HTMLDivElement>(null);
  const controllerRef = useRef(new AbortController());

  const image = isOpenImage();
  const update = isOpenUpdates();
  const ban = isOpenBanAccount();

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

  const getPosts = async (skip: any, take: number) => {
    try {
      const response = await axios.post("/api/archive", {
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
      reloadDeps: [session, select, ban.value],
    });

  const sortPostsByReports = (a: any, b: any) => {
    if (!a.reports || !b.reports) return 0;
    if (!a.reports.length || !b.reports.length) return 0;

    if (select === "most") {
      return b.reports[0].reasons.length - a.reports[0].reasons.length;
    } else {
      return a.reports[0].reasons.length - b.reports[0].reasons.length;
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-end p-6 gap-2 sm:pr-2">
        <select
          className="rounded-xl px-2 text-xl border border-black border-solid shadow-lg md:text-base sm:text-sm"
          onChange={(e) => setSelect(e.target.value)}
          defaultValue={"most"}
        >
          <option value="most">Most Report</option>
          <option value="least">Least Report</option>
        </select>
      </div>

      <div
        className="relative w-full h-full px-2 overflow-y-auto"
        ref={reference}
      >
        {!loading && !loadingMore && data && data.list.length === 0 ? (
          <div className="text-2xl font-semibold md:text-lg">No Reports</div>
        ) : (
          <div className="w-full pb-2">
            <ResponsiveMasonry>
              <Masonry gutter="10px">
                {data &&
                  data.list &&
                  data.list
                    .slice()
                    .sort(sortPostsByReports)
                    .map((item: any, key: any) => {
                      return (
                        item && (
                          <div
                            key={key}
                            className="p-2 pl-4 rounded-xl bg-slate-300 shadow-lg"
                          >
                            {/* ----------------------------------------------------------------- */}
                            <div className="flex items-center justify-end">
                              {!loading && (
                                <div className="flex items-center gap-2">
                                  <>
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
                                  </>
                                </div>
                              )}
                            </div>
                            {/* ----------------------------------------------------------------- */}
                            <div className="font-bold text-2xl">
                              {item.title}
                            </div>
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

                            <div className="flex items-center gap-2 overflow-x-auto">
                              <div className="text-4xl">
                                <CgProfile />
                              </div>

                              <div className="text-xl font-semibold">
                                {session?.user.role === "mod" &&
                                item.anonymous ? (
                                  "Anonymous"
                                ) : session?.user.role !== "mod" &&
                                  item.anonymous ? (
                                  <div className="flex items-center gap-1">
                                    {item.user.name}
                                    <div
                                      className="text-2xl tooltip tooltip-right font-normal"
                                      data-tip="Posted as Anonymous"
                                    >
                                      <BsIncognito />
                                    </div>
                                  </div>
                                ) : (
                                  item.user.name
                                )}
                              </div>
                            </div>
                            {/* ----------------------------------------------------------------- */}

                            <div className="text-lg break-words text-justify w-full">
                              {item.content}
                            </div>
                            {/* ----------------------------------------------------------------- */}
                            {item.image &&
                              item.image.startsWith("data:image/") && (
                                <img
                                  src={item.image}
                                  alt="image content"
                                  onClick={() => {
                                    image.source(item.image);
                                    image.open();
                                  }}
                                />
                              )}

                            {item.image &&
                              item.image.startsWith("data:video/") && (
                                <video controls>
                                  <source src={item.image} />
                                </video>
                              )}
                            {/* ----------------------------------------------------------------- */}
                            <div className="flex w-full items-center justify-center gap-10 mt-8">
                              <div className="flex items-center justify-center gap-1">
                                <div className="text-4xl">
                                  <IoIosWarning />
                                </div>
                                <div
                                  className="text-sm font-semibold -mb-3"
                                  style={{ color: "#CA0C0C" }}
                                >
                                  {item._count.reports} Previous Reports
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

export default Archive;
