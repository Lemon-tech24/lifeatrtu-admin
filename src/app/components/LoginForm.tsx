"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const LoginForm = () => {
  const [userInfo, setUserInfo] = useState<any>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: userInfo.username,
      password: userInfo.password,
    });
    console.log(res);
  };
  return (
    <div className="w-7/12 m-auto flex flex-col gap-5">
      <div className="text-center text-5xl">Sign In</div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-8/12 m-auto gap-5"
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) =>
            setUserInfo({ ...userInfo, username: e.target.value })
          }
          className="input rounded-2xl text-3xl px-4 py-1 bg-slate-300 text-black shadow-sm outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="***********"
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
          className="input rounded-2xl text-3xl px-4 py-1 bg-slate-300 text-black shadow-sm outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 m-auto px-8 rounded-2xl text-3xl"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
