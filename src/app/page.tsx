import { getServerSession } from "next-auth";
import LoginForm from "./components/LoginForm";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/dashboard");
  }
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <div className="w-1/2 min-h-screenflex items-center justify-center">
        <div className="flex w-full items-center justify-center flex-col">
          <div className="flex items-center justify-center gap-1">
            <div
              className="text-4xl bg-slate-300 rounded-2xl px-2 pl- pr-0 flex items-center justify-center leading-snug"
              style={{ letterSpacing: "0.4em" }}
            >
              Life@
            </div>
            <div
              style={{
                backgroundImage: "url('/textbg.png')",
                backgroundSize: "cover",
              }}
              className="text-img font-extrabold text-center bg-clip-text text-transparent text-9xl"
            >
              RTU
            </div>
          </div>
          {/* ------------------------------------------------ */}
          <div className="font-bold text-7xl">Welcome</div>
          <div className="text-4xl">Login to admin</div>
        </div>
      </div>
      <div className="w-1/2 min-h-screen flex justify-center flex-col">
        <LoginForm />
      </div>
    </main>
  );
}
