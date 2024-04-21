import { useCategorize } from "@/app/lib/useStore";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

let reports = [
  "Hate Speech",
  "Spam",
  "False Information",
  "Suicidal or Self Injury",
  "Harassment",
  "Violence",
  "Nudity",
  "Something Else",
];

const Categorize = ({ reload }: any) => {
  const categorize = useCategorize();

  const { data: session } = useSession();

  const [reportCategory, setReportCategory] = useState<string>("");
  const [disabled, setDisable] = useState<boolean>(false);
  const [disabledBTN, setDisabledBTN] = useState<boolean>(false);
  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disabled) {
      toast.error("Please Wait");
    }

    const loadingId = toast.loading("Processing...");
    const { signal } = controllerRef.current;

    setDisable(true);
    setTimeout(() => {
      setDisabledBTN(true);
      axios
        .post(
          "/api/categorize",
          { postId: categorize.postId, category: reportCategory },
          { signal: signal }
        )
        .then((response) => {
          const data = response.data;
          if (data.ok) {
            toast.success("Categorized Successfully");
            categorize.close();
          } else {
            toast.error("Failed to Categorized the Post");
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
          setDisable(false);
          setDisabledBTN(false);
          reload();
        });
    }, 500);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center animate-fadeIn duration-700 z-50 bg-slate-500/60">
      <div className="bg-white w-1/3 p-2 flex items-center flex-col rounded-xl gap-4 2xl:w-5/12 lg:w-7/12 md:w-10/12  xs:w-full xs:h-full xs:rounded-none xs:p-3">
        <div className="w-full flex items-center justify-between">
          <div className={`w-1/3 `}></div>

          <div
            className={`uppercase text-xl font-bold flex items-center justify-center w-1/3`}
          >
            Categorize Post
          </div>
          <button
            type="button"
            className={`text-3xl w-1/3 flex items-center justify-end ${disabledBTN && "hidden"}`}
            onClick={() => {
              categorize.close();
              categorize.setPostId("");
            }}
          >
            <IoClose />
          </button>
          {disabledBTN && <div className="w-1/3"></div>}
        </div>

        <form
          className="w-full flex flex-col items-start justify-center gap-2"
          onSubmit={handleSubmit}
        >
          {reports.map((item, key) => {
            return (
              <button
                key={key}
                onClick={() => {
                  setReportCategory(item.toLowerCase());
                }}
                type="button"
                className={`text-base font-semibold w-full flex items-center justify-start rounded-xl px-4 ${
                  reportCategory === item.toLowerCase() && "bg-slate-200"
                }`}
                disabled={disabled || disabledBTN}
              >
                {item}
              </button>
            );
          })}

          <div className="w-full flex items-center justify-center">
            <button
              type="submit"
              className={`bg-blue-800 uppercase text-base text-white rounded-xl px-2 ${disabledBTN ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={disabled || disabledBTN}
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Categorize;
