"use client";
import { authClient, signInGoogle } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignInBtnGoogle() {
  const router = useRouter();
  const handleSignIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
    toast.success("Signed in succesfully");
  };

  return (
    <Button variant="default" onClick={handleSignIn}>
      Sign In With Google
    </Button>
  );
}
