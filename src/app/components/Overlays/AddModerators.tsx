import { isOpenAddModerators, isOpenSettings } from "@/app/lib/useStore";
import React from "react";

const AddModerators = () => {
  const addMods = isOpenAddModerators();
  const settings = isOpenSettings();
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-6"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-2xl font-semibold">
          Add Moderators
        </div>
        <form className="w-full flex flex-col gap-2 items-center">
          <div className="flex gap-12 w-10/12">
            <p className="w-24 text-2xl">Username: </p>
            <input
              type="text"
              name="username"
              className="w-full rounded-lg px-4 text-lg"
              placeholder="Create Username"
            />
          </div>

          <div className="flex gap-12 w-10/12">
            <p className="w-24 text-2xl">Password: </p>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg px-4 text-lg"
              placeholder="*****************"
              minLength={8}
            />
          </div>
          <div className="flex w-10/12 m-auto">
            <span className="w-40"></span>

            <div className="text-xs">
              <p>Password must contain:</p>
              <div className="pl-3">
                At least 8 characters <br></br>
                At least 1 lowercase character <br></br>
                At least 1 uppercase character <br></br>
                At least 1 number or special character
              </div>
            </div>
          </div>

          <div className="flex gap-14 w-10/12">
            <p className="w-28 text-sm font-semibold">Confirm Password: </p>
            <input
              type="password"
              name="cpassword"
              className="w-full rounded-lg px-2 text-lg"
              placeholder="Confirm Password"
            />
          </div>

          <div className="w-10/12 flex items-center justify-center gap-4 mt-4">
            <button
              className="text-lg font-semibold rounded-lg px-2"
              style={{ backgroundColor: "#2D9054" }}
              type="submit"
            >
              Confirm
            </button>
            <button
              className="text-lg font-semibold rounded-lg px-2"
              style={{ backgroundColor: "#FF3F3F" }}
              onClick={() => {
                addMods.close();
                settings.open();
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModerators;
