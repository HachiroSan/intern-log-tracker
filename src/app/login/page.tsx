"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { SignInButton } from "@/components/auth/SignInButton";
import { Card, CardContent } from "@/components/ui/card";
import { Users, NotebookPen, Cat } from "lucide-react";
import { collection, query, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { useTheme } from "next-themes";

function StatsCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}) {
  return (
    <Card className="group flex-1 relative overflow-hidden border bg-white/80 backdrop-blur-sm transition-all hover:scale-105 duration-300 ease-out m-2 sm:m-3">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-4 sm:p-6 flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-2.5 sm:p-3 transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary transition-transform group-hover:scale-110" />
        </div>
        <div className="flex flex-col">
          <p className="text-xl sm:text-3xl font-bold font-mono tracking-tight">
            {value}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-primary border-t-transparent">
        <Cat className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce text-primary" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userCount, setUserCount] = useState("0");
  const [logCount, setLogCount] = useState("0");
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const usersQuery = query(collection(db, "users"));
        const userSnapshot = await getCountFromServer(usersQuery);
        setUserCount(userSnapshot.data().count.toLocaleString());

        const logsQuery = query(collection(db, "logs"));
        const logSnapshot = await getCountFromServer(logsQuery);
        setLogCount(logSnapshot.data().count.toLocaleString());
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }

    fetchCounts();
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-white to-pink-100 overflow-hidden flex items-center justify-center">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-neutral-100/25 bg-grid-8 [mask-image:radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black to-transparent pointer-events-none" />

      {/* Floating images */}
      <div className="absolute top-[6%] left-[5%] -translate-x-1/2 -translate-y-1/2 sm:top-20 sm:left-10 sm:translate-x-0 sm:translate-y-0 animate-float-slow">
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzhsMzQyZ29qcXExeXFpejVwdDd1OWZ4NWxyazFiZmExMHN4M2d0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YZevTvT9z9ubjeyCck/giphy.webp"
          alt="Cat meme 1"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl transform -rotate-6 opacity-50"
        />
      </div>
      <div className="absolute bottom-[3%] right-[15%] translate-x-1/2 translate-y-1/2 sm:bottom-10 sm:right-10 sm:translate-x-0 sm:translate-y-0 animate-float-delayed">
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzRyZ3QyZWh6Y3Z6OXEyd21nemQzNXdxb2hyeTU3ZTJleWtkNXdoMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wguujHuYVgqe5FvYUU/giphy.webp"
          alt="Cat meme 2"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl transform rotate-6 opacity-50"
        />
      </div>

      <main className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <section className="space-y-6 sm:space-y-8 w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-6 sm:gap-8 text-center">
            <h1 className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 sm:px-0 leading-tight">
              Track Your Logs
              <span className="block text-primary font-bold mt-2">
                All in One Place
              </span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground text-sm sm:text-base md:text-lg sm:leading-7 font-mono backdrop-blur-sm bg-white/30 p-4 rounded-lg">
              Hard to use Word to track your internships? Use this app to track
              your internships and log your daily activities. All stored in one
              place.
            </p>

            {/* Stats Section */}
            <div className="sm:gap-6 w-full max-w-[42rem] mt-8 sm:mt-10 flex justify-center">
              <StatsCard
                icon={Users}
                label="Registered Users"
                value={`${userCount}`}
              />
              <StatsCard
                icon={NotebookPen}
                label="Logs Recorded"
                value={`${logCount}`}
              />
            </div>

            <div className="w-full sm:w-auto mt-6 sm:mt-8">
              <SignInButton
                isAdventure
                className="w-full sm:w-auto text-lg py-3 px-6"
              />
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(-6deg);
          }
          50% {
            transform: translateY(-20px) rotate(-3deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(6deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: -3s;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
