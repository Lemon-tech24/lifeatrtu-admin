/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { CgProfile } from "react-icons/cg";
import { IoIosWarning } from "react-icons/io";
import { FaCommentAlt } from "react-icons/fa";
import { isOpenImage, isOpenUpdates } from "../lib/useStore";
import moment from "moment";

const LowPosts = ({ data }: any) => {
  const update = isOpenUpdates();
  const image = isOpenImage();
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
                    <div className="">
                      {moment(item.createdAt).format("LLL")}
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

                      <button
                        type="button"
                        className={`flex items-center justify-center gap-1 `}
                        onClick={update.open}
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
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
};

export default LowPosts;
