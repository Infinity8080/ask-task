import { auth } from "@/auth";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";
import Features from "@/components/features";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userLoggedin = session?.session.id;
  return (
    <div>
      <HeroHeader />
      <HeroSection />
      <Features />
    </div>
  );
}
