import { isOpenAddModerators, isOpenSettings } from "@/app/lib/useStore";
import React, { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createModerator } from "@/app/actions/createMods";
import toast from "react-hot-toast";

const AddModerators = () => {
  const addMods = isOpenAddModerators();
  const settings = isOpenSettings();
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCPassword] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [same, setSame] = useState<boolean>(false);

  const [state, formAction] = useFormState(createModerator, undefined);
  const { pending } = useFormStatus();

  const passwordChange = (e: any) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsValid(
      newPassword.length >= 8 &&
        /[a-z]/.test(newPassword) &&
        /[A-Z]/.test(newPassword) &&
        /[0-9!@#$%^&*()_+|~\-=`{}[\]:";'<>?,./]/.test(newPassword)
    );
  };

  const confirmPassword = (e: any) => {
    const cpass = e.target.value;
    setCPassword(cpass);
    if (cpassword !== "" && password !== "" && isValid) {
      setSame(cpass === password);
    } else {
      setSame(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-6"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-2xl font-semibold">
          Add Moderators
        </div>
        <form
          className="w-full flex flex-col gap-2 items-center"
          action={formAction}
        >
          <div className="flex gap-12 w-10/12">
            <p className="w-24 text-2xl">Username: </p>
            <input
              type="text"
              name="username"
              className="w-full rounded-lg px-4 text-lg"
              placeholder="Create Username"
              required
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
              onChange={passwordChange}
              required
            />
          </div>
          <div className="flex w-10/12 m-auto">
            <span className="w-40"></span>

            <div className="text-xs">
              <p>Password must contain:</p>
              <div className="pl-3">
                <p>{isValid ? "✅" : "❌"} At least 8 characters</p>
                <p className="">
                  {/[a-z]/.test(password) ? "✅" : "❌"} At least 1 lowercase
                  character
                </p>
                <p>
                  {/[A-Z]/.test(password) ? "✅" : "❌"} At least 1 uppercase
                  character
                </p>
                <p>
                  {/[0-9!@#$%^&*()_+|~\-=`{}[\]:";'<>?,./]/.test(password)
                    ? "✅"
                    : "❌"}{" "}
                  At least 1 number or special character
                </p>
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
              onChange={confirmPassword}
              required
            />
          </div>
          <div>
            <p className="text-xs">{same ? "✅" : "❌"} Passwords match</p>
          </div>

          <div className="w-10/12 flex items-center justify-center gap-4 mt-4">
            <button
              className={`text-lg font-semibold rounded-lg px-2 ${same ? "cursor-pointer" : "cursor-not-allowed"}`}
              style={{ backgroundColor: "#2D9054" }}
              type="submit"
              disabled={same ? false : true}
              aria-disabled={pending}
            >
              Confirm
            </button>
            <button
              className="text-lg font-semibold rounded-lg px-2"
              style={{ backgroundColor: "#FF3F3F" }}
              onClick={() => {
                addMods.close();
                settings.open();
                setPassword("");
                setCPassword("");
                setIsValid(false);
                setSame(false);
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
