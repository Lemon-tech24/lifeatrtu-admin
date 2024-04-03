/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useInfiniteScroll } from "ahooks";
import { useSession } from "next-auth/react";

import Skeleton from "@/app/components/UI/Skeleton";
import { CgProfile } from "react-icons/cg";
import moment from "moment";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  DisregardReport,
  isMarkAsDone,
  isOpenBanAccount,
  isOpenImage,
  isOpenReport,
  isOpenUpdates,
  useMultipleSelect,
} from "../lib/useStore";
import { IoIosWarning } from "react-icons/io";
import { FaCommentAlt } from "react-icons/fa";
import { BsIncognito } from "react-icons/bs";
import toast from "react-hot-toast";
import MultipleSelect from "./MultipleSelect";

const HighRiskReports = () => {
  const { data: session } = useSession();
  const [select, setSelect] = useState<string>("most");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [disableBTN, setDisabledBTN] = useState<boolean>(false);

  const reference = useRef<HTMLDivElement>(null);
  const controllerRef = useRef(new AbortController());

  const image = isOpenImage();
  const report = isOpenReport();
  const update = isOpenUpdates();
  const markDone = isMarkAsDone();
  const ban = isOpenBanAccount();
  const disregard = DisregardReport();
  const selection = useMultipleSelect();

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

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
      reloadDeps: [session, select, ban.value],
    });

  const MarkDelete = (postId: string) => {
    const loadingId = toast.loading("Deleting...");
    const { signal } = controllerRef.current;

    if (disabled) {
      toast.error("Please Wait");
    }

    setDisabledBTN(true);

    setTimeout(() => {
      setDisabled(true);
      axios
        .post("/api/delete", { postId: postId }, { signal: signal })
        .then((response) => {
          const data = response.data;

          if (data.ok) {
            toast.success("Successfully Deleted");
            reload();
          } else {
            toast.error("Failed To Delete");
            throw new Error();
          }
        })
        .catch((err) => {
          if (err.name === "CanceledError") {
            toast.error("Canceled");
          }

          toast.error("Error Occurred");
        })
        .finally(() => {
          toast.dismiss(loadingId);
          setDisabled(false);
          setDisabledBTN(false);
        });
    }, 500);
  };

  const Disregard = (postId: string) => {
    const loadingId = toast.loading("Processing...");
    const { signal } = controllerRef.current;

    if (disabled) {
      toast.error("Please Wait");
    }

    setDisabledBTN(true);

    setTimeout(() => {
      setDisabled(true);
      axios
        .post("/api/disregard", { postId: postId }, { signal: signal })
        .then((response) => {
          const data = response.data;

          if (data.ok) {
            toast.success("Disregarded");
            reload();
          } else {
            toast.error("Error Disregarding Post");
          }
        })
        .catch((err) => {
          if (err.name === "CanceledError") {
            toast.error("Canceled");
          }

          toast.error("Error Occurred");
        })
        .finally(() => {
          toast.dismiss(loadingId);
          setDisabled(false);
          setDisabledBTN(false);
        });
    }, 500);
  };

  const sortPostsByReports = (a: any, b: any) => {
    if (!a.reports || !b.reports) return 0;
    if (!a.reports.length || !b.reports.length) return 0;

    if (select === "most") {
      return b.reports[0].reasons.length - a.reports[0].reasons.length;
    } else {
      return a.reports[0].reasons.length - b.reports[0].reasons.length;
    }
  };

  const checkboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      selection.setList([...selection.list, value]);
    } else {
      selection.setList(selection.list.filter((id) => id !== value));
    }
  };

  const requestDelete = (postId: string) => {
    const loadingId = toast.loading("Requesting to Delete...");
    const { signal } = controllerRef.current;
    if (disabled) {
      toast.error("Please Wait");
    }

    setDisabledBTN(true);

    setTimeout(() => {
      setDisabled(true);
      axios
        .post("/api/request/delete", { postId: postId }, { signal: signal })
        .then((response) => {
          const data = response.data;

          if (data.ok) {
            toast.success("Deletion Request Sent");
            reload();
          } else {
            toast.error("Failed to Request");
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
    <>
      <div className="w-full flex items-center justify-end p-6 gap-2 sm:pr-2">
        <MultipleSelect
          reload={reload}
          loading={loading}
          loadingMore={loadingMore}
          tab={"high"}
        />
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
                      const totalReports = item.reports.reduce(
                        (acc: number, report: any) =>
                          acc + report.reasons.length,
                        0
                      );
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
                                  <button
                                    className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                                    onClick={() => requestDelete(item.id)}
                                    disabled={disabled || disableBTN}
                                  >
                                    Request to Delete
                                  </button>
                                ) : (
                                  <></>
                                )
                              ) : (
                                <div className="flex items-center gap-2">
                                  {selection.isOpen ? (
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 accent-black"
                                      checked={selection.list.includes(item.id)}
                                      value={item.id}
                                      onChange={checkboxChange}
                                      disabled={disabled || disableBTN}
                                    />
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                                        onClick={() => {
                                          markDone.setPostId(item.id);
                                          if (item.id === markDone.postId) {
                                            MarkDelete(markDone.postId);
                                          }
                                        }}
                                        disabled={disabled || disableBTN}
                                      >
                                        Delete
                                      </button>
                                      <button
                                        type="button"
                                        className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                                        onClick={() => {
                                          disregard.setPostId(item.id);
                                          if (item.id === disregard.postId) {
                                            Disregard(disregard.postId);
                                          }
                                        }}
                                        disabled={disabled || disableBTN}
                                      >
                                        Disregard
                                      </button>
                                      <button
                                        type="button"
                                        className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                                        onClick={() => {
                                          ban.setUserId(item.user.id);
                                          ban.setEmail(item.user.email);
                                          ban.open();
                                        }}
                                        disabled={disabled || disableBTN}
                                      >
                                        Ban
                                      </button>
                                    </>
                                  )}
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
                                  {totalReports} REPORTS
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
