"use client";

import "./globals.css";
import NavigationMenuBar from "@/components/navigation-bar/NavigationBar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your App Title</title>
      </head>
      <body>
        <UserProvider>
          {/* Show NavigationMenuBar if user is authenticated and not on the login page */}
          {user && pathname !== "/login" && <NavigationMenuBar />}
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
