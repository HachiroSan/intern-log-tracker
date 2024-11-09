"use client";

import { InternshipLogger } from "@/components/InternshipLogger";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}

export default function Home() {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">
          Error loading application. Please try again later.
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-16">
        <Suspense fallback={<LoadingSpinner />}>
          <InternshipLogger />
        </Suspense>
      </div>
    </div>
  );
}
