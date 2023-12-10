"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./components/Button";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [Username, setUsername] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  return (
    <div>
      <input
        type="text"
        name="username"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        style="text-2xl"
        type="button"
        content="SignIn"
        onClick={() =>
          signIn("credentials", {
            username: Username,
            password: Password,
            callbackUrl: "/home",
            redirect: false,
          }).then((response) => {
            if (!response) {
              return;
            }
          })
        }
      />
    </div>
  );
}
