"use client";
import React, { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const { data: session, status } = useSession();
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>({
    username: "",
    password: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setDisabled(true);
    const loadingId = toast.loading("Loading...");
    if (userInfo && userInfo.username !== "" && userInfo.password !== "") {
      try {
        const res = await signIn("credentials", {
          username: userInfo.username,
          password: userInfo.password,
          redirect: false,
        });

        if (res && res.ok && !res.error) {
          toast.dismiss(loadingId);
          toast.success("Successfully Logged In");
          setLoggedIn(true);
        } else {
          setUserInfo({
            username: "",
            password: "",
          });
          formRef.current && formRef.current.reset();
          toast.dismiss(loadingId);
          toast.error("Invalid Username or Password");
        }
      } catch (error) {
        setUserInfo({
          username: "",
          password: "",
        });
        formRef.current && formRef.current.reset();
        toast.dismiss(loadingId);
        toast.error("An error occurred while logging in");
        console.error("Login error:", error);
      } finally {
        setDisabled(false);
      }
    }
  };

  useEffect(() => {
    if (session && session.user && loggedIn) {
      router.push("/dashboard");
    }
  }, [session, loggedIn, router]);

  return (
    <div className="w-7/12 m-auto flex flex-col gap-5 xl:w-10/12 md:m-0 md:w-full">
      <div className="text-center text-5xl md:text-4xl">Sign In</div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-8/12 m-auto gap-5 xs:w-11/12"
        ref={formRef}
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) =>
            setUserInfo({ ...userInfo, username: e.target.value })
          }
          className="input rounded-2xl text-3xl xs:text-xl px-4 py-1 bg-slate-300 text-black shadow-sm outline-none text-center"
          required={true}
        />
        <input
          type="password"
          name="password"
          placeholder="***********"
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
          className="input rounded-2xl text-3xl xs:text-xl px-4 py-1 bg-slate-300 text-black shadow-sm outline-none text-center"
          required={true}
        />
        <button
          type="submit"
          className={`bg-blue-500 m-auto px-8 rounded-2xl py-1 text-2xl xs:text-lg ${status === "loading" || disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled={status === "loading" || disabled ? true : false}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
