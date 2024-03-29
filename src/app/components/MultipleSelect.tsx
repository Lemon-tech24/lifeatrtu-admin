import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  RiCheckboxMultipleFill,
  RiCheckboxMultipleBlankLine,
} from "react-icons/ri";
import { useMultipleSelect } from "../lib/useStore";
import { useSession } from "next-auth/react";

const MultipleSelect = ({ reload, loading, loadingMore, tab }: any) => {
  const selection = useMultipleSelect();
  const { data: session } = useSession();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [disableBTN, setDisabledBTN] = useState<boolean>(false);

  const controllerRef = useRef(new AbortController());

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

  const handleDeleteAll = () => {
    const loadingId = toast.loading("Deleting All Selected");

    if (disabled) {
      toast.error("Please Wait");
    }

    const { signal } = controllerRef.current;

    setDisabledBTN(true);

    setTimeout(() => {
      setDisabled(true);
      if (
        selection.list &&
        selection.list.length > 0 &&
        selection.list !== null &&
        selection.list !== undefined
      ) {
        axios
          .post("/api/delete/all", { list: selection.list }, { signal: signal })
          .then((response) => {
            const data = response.data;
            if (data.ok) {
              toast.success("Successfully Deleted");

              if (reload) {
                reload();
              }
            } else {
              toast.error("Error Occurred");
            }
          })
          .catch((err) => {
            if (err.name === "CanceledError") {
              toast.error("Canceled");
            }
          })
          .finally(() => {
            selection.setClose();
            selection.setList([]);
            setDisabled(false);
            setDisabledBTN(false);
            toast.dismiss(loadingId);
          });
      } else {
        toast.dismiss(loadingId);
        setDisabled(false);
        setDisabledBTN(false);
        toast.error("There's No Selected Post.");
      }
    }, 500);
  };

  const handleDisregardAll = () => {
    const loadingId = toast.loading("Disregarding All Selected...");

    if (disabled) {
      toast.error("Please Wait");
    }

    const { signal } = controllerRef.current;

    setDisabledBTN(true);

    setTimeout(() => {
      setDisabled(true);
      if (
        selection.list &&
        selection.list.length > 0 &&
        selection.list !== null &&
        selection.list !== undefined
      ) {
        axios
          .post(
            "/api/disregard/all",
            { list: selection.list },
            { signal: signal }
          )
          .then((response) => {
            const data = response.data;
            if (data.ok) {
              toast.success("Successfully Disregarded");

              if (reload) {
                reload();
              }
            } else {
              toast.error("Error Occurred");
            }
          })
          .catch((err) => {
            if (err.name === "CanceledError") {
              toast.error("Canceled");
            }
          })
          .finally(() => {
            selection.setClose();
            selection.setList([]);
            setDisabled(false);
            setDisabledBTN(false);
            toast.dismiss(loadingId);
          });
      } else {
        toast.dismiss(loadingId);
        setDisabled(false);
        setDisabledBTN(false);
        toast.error("There's No Selected Post.");
      }
    }, 500);
  };

  return (
    session &&
    session.user.role !== "mod" && (
      <div className="flex gap-2 items-center sm:gap-[2px]">
        {selection.isOpen && (
          <div className="flex items-center gap-2 animate-fadeIn sm:gap-[2px]">
            <button
              type="button"
              className={`text-base sm:text-xs px-2 rounded-xl bg-slate-400/80 border border-solid border-black ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={handleDeleteAll}
              disabled={disabled || loading || loadingMore || disableBTN}
              aria-disabled={disabled || loading || loadingMore || disableBTN}
            >
              {tab === "pending" ? "Approve" : "Delete"}
            </button>
            <button
              type="button"
              className={`text-base sm:text-xs px-2 rounded-xl bg-slate-400/80 border border-solid border-black ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={disabled || loading || loadingMore || disableBTN}
              aria-disabled={disabled || loading || loadingMore || disableBTN}
              onClick={handleDisregardAll}
            >
              Disregard
            </button>
          </div>
        )}
        <button
          type="button"
          className={`text-3xl sm:text-2xl flex items-center ${!selection.isOpen && "tooltip tooltip-left"} ${disableBTN && "hidden"}`}
          onClick={() => {
            selection.setList([]);

            if (selection.isOpen) {
              selection.setClose();
            } else {
              selection.setOpen();
            }
          }}
          data-tip="Multiple Selection"
          disabled={disabled || loading || loadingMore || disableBTN}
          aria-disabled={disabled || loading || loadingMore || disableBTN}
        >
          {selection.isOpen ? (
            <RiCheckboxMultipleFill />
          ) : (
            <RiCheckboxMultipleBlankLine />
          )}
        </button>
      </div>
    )
  );
};

export default MultipleSelect;
