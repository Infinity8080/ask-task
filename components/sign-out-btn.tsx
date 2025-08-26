"use client";
import { authClient, signInGoogle } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignOutBtn() {
  const router = useRouter();
  const handleSignIn = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Signed out succesfully");
    }
    router.refresh();
  };

  return (
    <Button variant="default" onClick={handleSignIn}>
      Sign out!
    </Button>
  );
}
