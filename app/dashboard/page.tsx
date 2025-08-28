import SignOutBtn from "@/components/sign-out-btn";
import UserConversations from "@/components/user-conversations";
import { Bubbles } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="h-screen w-full relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
        }}
      />

      {/* NavBar */}
      <nav className="p-2 shadow-md flex items-center justify-between mx-2 relative z-10 flex-shrink-0">
        <div className="flex p-2 rounded-sm">
          <Bubbles />
          AskTask
        </div>
        <div className="flex space-x-4">
          <SignOutBtn />
        </div>
      </nav>

      {/* Dashboard */}
      <div className="relative z-10 p-4 flex-1 flex flex-col">
        <div className="flex flex-1 overflow-hidden space-x-2">
          <section className="border-2 p-2 rounded-md flex-1">
            <UserConversations />
          </section>
        </div>
      </div>
    </main>
  );
}
