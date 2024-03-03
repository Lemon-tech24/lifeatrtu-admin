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
    <main className="flex min-h-screen w-full items-center justify-center md:flex-col md:gap-8">
      <div className="w-1/2 h-full flex items-center justify-center md:w-full">
        <div className="flex w-full items-center justify-center flex-col">
          <div className="flex items-center justify-center gap-1 xxs:flex-wrap">
            <div
              className="text-4xl xs:text-3xl bg-slate-300 rounded-2xl px-2 pl- pr-0 flex items-center justify-center leading-snug"
              style={{ letterSpacing: "0.4em" }}
            >
              Life@
            </div>
            <div
              style={{
                backgroundImage: "url('/textbg.png')",
                backgroundSize: "cover",
              }}
              className="text-9xl xs:text-8xl font-extrabold text-center bg-clip-text text-transparent"
            >
              RTU
            </div>
          </div>
          {/* ------------------------------------------------ */}
          <div className="font-bold text-7xl xs:text-5xl">Welcome</div>
          <div className="text-4xl md:mt-10 xs:text-2xl">Login to admin</div>
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center flex-col md:w-full">
        <LoginForm />
      </div>
    </main>
  );
}
