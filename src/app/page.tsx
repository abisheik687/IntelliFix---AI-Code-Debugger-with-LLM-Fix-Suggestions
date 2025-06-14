"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth"; // Make sure AuthProvider is here

function HomePageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
          <path d="M12 22V12"></path>
          <path d="M20 12v5.5"></path>
          <path d="M4 12v5.5"></path>
          <path d="M12 2l-2.5 2.5"></path>
          <path d="M12 2l2.5 2.5"></path>
        </svg>
        <p className="text-muted-foreground">Loading IntelliFix...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomePageContent />
    </AuthProvider>
  );
}
