/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { CgProfile } from "react-icons/cg";
import { IoIosWarning } from "react-icons/io";
import { FaCommentAlt } from "react-icons/fa";
import {
  DisregardReport,
  isMarkAsDone,
  isOpenBanAccount,
  isOpenImage,
  isOpenReport,
  isOpenUpdates,
} from "../lib/useStore";
import moment from "moment";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
import Skeleton from "@/app/components/UI/Skeleton";

const LowPosts = ({
  data,
  mutate,
  loading,
  loadingMore,
  noMore,
  reload,
}: any) => {
  const { data: session } = useSession();
  const update = isOpenUpdates();
  const image = isOpenImage();
  const report = isOpenReport();
  const markDone = isMarkAsDone();
  const ban = isOpenBanAccount();
  const disregard = DisregardReport();

  const requestDelete = async (postId: string) => {
    const loadingId = toast.loading("Requesting...");
    try {
      const response = await axios.post("/api/request/delete", {
        postId: postId,
      });

      const data = response.data;

      if (data.ok) {
        mutate((currentData: any) => {
          const updatedList = currentData.list.map((item: any) => {
            if (item.id === postId) {
              return { ...item, pending: true };
            }
            return item;
          });
          return { ...currentData, list: updatedList };
        });

        toast.dismiss(loadingId);
        toast.success("Request to Delete Success");
      } else {
        toast.dismiss(loadingId);
        toast.error("Request to Delete Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("ERROR");
    }
  };

  const MarkDelete = async (postId: any) => {
    const controller = new AbortController();
    const loadingId = toast.loading("Deleting...");
    try {
      const response = await axios.post("/api/delete", {
        postId: postId,
        signal: controller.signal,
      });

      const data = response.data;

      if (data.ok) {
        toast.dismiss(loadingId);
        toast.success("Successfully Deleted");
        reload();
      } else {
        toast.dismiss(loadingId);
        toast.error("Failed to Delete");
      }

      return controller.abort();
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingId);
      toast.error("ERROR");
    }
  };

  const Disregard = async (postId: string) => {
    const loadingId = toast.loading("Processing...");
    try {
      const response = await axios.post("/api/disregard", { postId: postId });

      const data = response.data;
      toast.dismiss(loadingId);
      if (data.ok) {
        toast.success("Disregarded");
      } else {
        toast.error("Error Disregarding Post");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
                          <button
                            onClick={() => requestDelete(item.id)}
                            className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                          >
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
                            Delete
                          </button>
                          <button
                            className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
                            onClick={() => {
                              disregard.setPostId(item.id);
                              if (item.id === disregard.postId) {
                                Disregard(disregard.postId);
                              }
                            }}
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
                          {item.reports[0].reasons.length} REPORTS
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
    </>
  );
};

export default LowPosts;
