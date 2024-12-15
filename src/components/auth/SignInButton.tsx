import { LogIn, Wand2 } from "lucide-react";
import { useSignIn } from "@/hooks/useSignIn";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FC } from "react";

interface SignInButtonProps {
  className?: string;
  isAdventure?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export const SignInButton: FC<SignInButtonProps> = ({
  className,
  isAdventure = false,
  size = "default",
}) => {
  const { signIn, isLoading } = useSignIn();

  return (
    <Button
      onClick={signIn}
      disabled={isLoading}
      size={size}
      className={cn(
        "relative group transition-all duration-300",
        isLoading && "cursor-not-allowed",
        isAdventure &&
          "font-mono bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-16",
        className
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center gap-2",
          isLoading && "opacity-0"
        )}
      >
        {isAdventure ? (
          <>
            Join the Adventure
            <Wand2 className="ml-2 h-4 w-5 animate-bounce" />
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            Sign in with Google
          </>
        )}
      </span>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="ml-2">Signing in...</span>
        </div>
      )}
    </Button>
  );
};
