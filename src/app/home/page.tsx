"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

function page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [session]);
  return (
    <div>
      <Button
        type="button"
        content="logout"
        onClick={() => signOut({ callbackUrl: "/" })}
      />

      {session ? session.user.name : "not authenticated"}
    </div>
  );
}

export default page;
