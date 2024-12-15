import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { useRouter } from "next/navigation";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      // You might want to add toast notification here for better UX
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading };
};
