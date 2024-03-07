/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { isOpenImage } from "@/app/lib/useStore";
import React from "react";
import { CgClose } from "react-icons/cg";

const ImagePost = () => {
  const image = isOpenImage();
  return (
    <div className="relative top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white">
      <button
        type="button"
        className="text-6xl absolute top-2 right-12 text-red-800"
        onClick={() => {
          image.close();
          image.clearSource();
        }}
      >
        <CgClose />
      </button>
      <img
        src={image.src}
        alt="Image"
        className="border border-black border-solid"
      />
    </div>
  );
};

export default ImagePost;
