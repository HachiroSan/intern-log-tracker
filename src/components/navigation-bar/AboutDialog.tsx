import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Prevent the hydration warning
const DynamicImage = dynamic(() => import("next/image"), { ssr: false });

export default function AboutDialog() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DialogHeader className="space-y-3">
      <DialogTitle className="text-2xl font-mono font-bold">About</DialogTitle>
      <DialogDescription className="flex flex-col">
        {isMounted && (
          <DynamicImage
            src="https://i.giphy.com/media/1dcLFNKRUKvte/200w.gif"
            alt="Naruto and Sasuke monochrome"
            className="rounded-xl w-64 h-auto object-contain mx-auto mt-6"
            width={128}
            height={128}
            unoptimized
          />
        )}
        <span className="font-mono text-center pt-6 block">
          {"/\\* "}Another small project crafted with{" "}
          <span className="text-primary">
            {"<"}❤️{">"}
          </span>{" "}
          {" \\*/"}
        </span>
        <span className="font-mono text-sm text-center pt-6">
          Contributing to the community, one commit at a time.{" "}
          <a
            href="https://farhad.my"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-mono"
          >
            ~/farhad.my
          </a>
        </span>
      </DialogDescription>
    </DialogHeader>
  );
}
