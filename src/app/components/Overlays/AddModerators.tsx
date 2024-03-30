import { isOpenAddModerators, isOpenSettings } from "@/app/lib/useStore";
import React, { ChangeEvent, use, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from "axios";

const AddModerators = () => {
  const addMods = isOpenAddModerators();
  const settings = isOpenSettings();
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [same, setSame] = useState<boolean>(false);
  const controllerRef = useRef<AbortController>(new AbortController());

  const { data: session } = useSession();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    return () => controllerRef.current?.abort();
  }, [session]);

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

  const [disable, setDisable] = useState<boolean>(false);
  const [disableBTN, setDisabledBTN] = useState<boolean>(false);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingId = toast.loading("Loading");

    const { signal } = controllerRef.current;

    if (disable) {
      toast.error("Please Wait");
    }

    setDisable(true);
    if (same && isValid) {
      setTimeout(() => {
        setDisabledBTN(true);

        axios
          .post(
            "/api/moderator/create",
            {
              username: username,
              pass: password,
              cpass: cpassword,
            },
            { signal: signal }
          )
          .then((response) => {
            const data = response.data;

            if (data.ok) {
              toast.success(data.msg);
            } else {
              toast.error(data.msg);
            }
          })
          .catch((err) => {
            if (err.name === "CanceledError") {
              return toast.error("Canceled");
            }
            return toast.error("Error Occurred");
          })
          .finally(() => {
            toast.dismiss(loadingId);
            formRef.current && formRef.current.reset();
            setPassword("");
            setCPassword("");
            setUsername("");
            setIsValid(false);
            setSame(false);
            setDisable(false);
            setDisabledBTN(false);
          });
      }, 500);
    } else {
      toast.dismiss(loadingId);
      toast.error("Invalid Username or Password");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-slate-500/80 z-50 flex items-center justify-center">
      <div
        className="w-5/12 rounded-xl flex flex-col gap-10 p-6 xl:w-8/12 md:w-11/12 sm:w-full sm:h-full sm:rounded-none sm:items-center justify-center"
        style={{ backgroundColor: "#D9D9D9" }}
      >
        <div className="w-full flex items-center justify-center uppercase text-2xl font-semibold">
          Add Moderators
        </div>
        <form
          className="w-full flex flex-col gap-2 items-center"
          autoComplete="off"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex gap-12 w-10/12 sm:w-full">
            <p className="w-24 text-2xl md:text-xl">Username: </p>
            <input
              type="text"
              name="username"
              className="w-full rounded-lg px-4 text-lg md:text-base"
              placeholder="Create Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-12 w-10/12 sm:w-full">
            <p className="w-24 text-2xl md:text-xl">Password: </p>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg px-4 text-lg md:text-base"
              placeholder="*****************"
              minLength={8}
              value={password}
              onChange={passwordChange}
              required
            />
          </div>
          <div className="flex w-10/12 m-auto sm:w-full">
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

          <div className="flex gap-14 w-10/12 sm:w-full">
            <p className="w-28 text-sm font-semibold">Confirm Password: </p>
            <input
              type="password"
              name="cpassword"
              value={cpassword}
              className="w-full rounded-lg px-2 text-lg md:text-base"
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
              className={`text-lg md:text-base font-semibold rounded-lg px-2 ${same ? "cursor-pointer" : "cursor-not-allowed"}`}
              style={{ backgroundColor: "#2D9054" }}
              type="submit"
              disabled={disableBTN || disable}
            >
              Confirm
            </button>
            <button
              className={`text-lg font-semibold rounded-lg px-2 md:text-base ${disableBTN && "hidden"}`}
              style={{ backgroundColor: "#FF3F3F" }}
              onClick={() => {
                controllerRef.current.abort();
                addMods.close();
                settings.open();
                setPassword("");
                setCPassword("");
                setUsername("");
                setIsValid(false);
                setSame(false);
              }}
              type="button"
              disabled={disableBTN}
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
