/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const Login = () => {
    const response = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post("http://localhost:3000/login", {
          username: username,
          password: password,
        });
        const data = res.data;
        if (data.ok) {
          resolve(data);
        }
        reject(data);
      } catch (err) {
        console.error(err);
        reject();
      }
    });

    toast.promise(response, {
      loading: () => `Loading...`,
      success: (data) => `Sucess: ${data.message}`,
      error: () => `Error Occured`,
    });
  };
  return (
    <>
      <Toaster />
      <form onSubmit={Login}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="text-2xl"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
