import SignOutBtn from "@/components/sign-out-btn";
import UserConversations from "@/components/user-conversations";
import { Bubbles } from "lucide-react";
import { auth } from "@/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userAvatarSrc = session?.user.image || null;
  console.log(userAvatarSrc);

  return (
    <main className="h-screen w-full relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(var(--primary) / 0.4), transparent 70%), oklch(var(--background))",
        }}
      />

      {/* NavBar */}
      <nav className="p-2  flex items-center justify-between mx-2 relative z-10 flex-shrink-0 ">
        <div>
          <Link href={"/"}>
            <div className="flex items-center">
              <Bubbles />
              AskTask
            </div>
          </Link>
        </div>
        <div className="flex space-x-4">
          <ModeToggle />
          <SignOutBtn />
        </div>
      </nav>

      {/* Dashboard */}
      <div className="relative z-10 p-4 flex-1 flex flex-col">
        <div className="flex flex-1 space-x-2">
          <section className="p-2  flex-1">
            <UserConversations userAvatarSrc={userAvatarSrc as string} />
          </section>
        </div>
      </div>
    </main>
  );
}
