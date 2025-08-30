import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});
const signInGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  
  return data;
};
const signOutGoogle = async () => {
  const data = await authClient.signOut();
  return data;
};
export { signInGoogle, signOutGoogle };
