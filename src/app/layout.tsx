import type { Metadata } from "next";

import "./globals.css";
import AuthProvider from "./lib/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  icons: "",
  title: "Life@RTU: Admin Panel",
  description: "Life@RTU: Admin Panel",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Toaster />
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
