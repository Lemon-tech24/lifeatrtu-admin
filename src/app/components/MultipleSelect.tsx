import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  RiCheckboxMultipleFill,
  RiCheckboxMultipleBlankLine,
} from "react-icons/ri";
import { useMultipleSelect } from "../lib/useStore";

const MultipleSelect = ({ reload, loading, loadingMore, tab }: any) => {
  const selection = useMultipleSelect();
  const [disabled, setDisabled] = useState<boolean>(false);

  const deleteAll = async () => {
    setDisabled(true);
    const loadingId = toast.loading("Deleting All Selected...");

    try {
      if (
        selection.list &&
        selection.list.length > 0 &&
        selection.list !== null &&
        selection.list !== undefined
      ) {
        const response = await axios.post("/api/delete/all", {
          list: selection.list,
        });

        if (response.data.ok) {
          toast.success("Successfully Deleted");

          if (reload) {
            reload();
          }
        } else {
          toast.error("Error Occurred");
        }
      } else {
        toast.error("There's No Selected Post.");
      }
    } catch (err) {
      toast.error("Error Occurred");
      console.error("Error occurred while deleting:", err);
    } finally {
      selection.setClose();
      selection.setList([]);
      setDisabled(false);
      toast.dismiss(loadingId);
    }
  };

  const disregardAll = async () => {
    setDisabled(true);
    const loadingId = toast.loading("Disregarding All Selected...");
    try {
      if (
        selection.list &&
        selection.list.length > 0 &&
        selection.list !== null &&
        selection.list !== undefined
      ) {
        const response = await axios.post("/api/disregard/all", {
          list: selection.list,
        });

        if (response.data.ok) {
          toast.success("Success");
          if (reload) {
            reload();
          }
        } else {
          toast.error("Error Occurred");
        }
      } else {
        toast.error("There's No Selected Post.");
      }
    } catch (err) {
      toast.error("Error Occurred");
      console.error("Error occurred while deleting:", err);
    } finally {
      selection.setClose();
      selection.setList([]);
      setDisabled(false);
      toast.dismiss(loadingId);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {selection.isOpen && (
        <div className="flex items-center gap-2 animate-fadeIn">
          <button
            type="button"
            className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
            onClick={deleteAll}
            disabled={disabled || loading || loadingMore}
            aria-disabled={disabled}
          >
            {tab === "pending" ? "Approve All" : "Delete All"}
          </button>
          <button
            type="button"
            className="text-base px-2 rounded-xl bg-slate-400/80 border border-solid border-black"
            disabled={disabled || loading || loadingMore}
            aria-disabled={disabled || loading || loadingMore}
            onClick={disregardAll}
          >
            Disregard All
          </button>
        </div>
      )}
      <button
        type="button"
        className={`text-3xl flex items-center ${!selection.isOpen && "tooltip tooltip-left"}`}
        onClick={() => {
          selection.setList([]);

          if (selection.isOpen) {
            selection.setClose();
          } else {
            selection.setOpen();
          }
        }}
        data-tip="Multiple Selection"
        disabled={disabled || loading || loadingMore}
        aria-disabled={disabled || loading || loadingMore}
      >
        {selection.isOpen ? (
          <RiCheckboxMultipleFill />
        ) : (
          <RiCheckboxMultipleBlankLine />
        )}
      </button>
    </div>
  );
};

export default MultipleSelect;
