import { auth } from "@/auth";
import SignInBtnGoogle from "@/components/sign-in-btn-google";
import SignOutBtnGoogle from "@/components/sign-out-btn-google";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userLoggedin = session?.session.id;
  return (
    <div>
      Hello World
      <SignInBtnGoogle />
      {userLoggedin ? <SignOutBtnGoogle /> : <>Please log in</>}
    </div>
  );
}
