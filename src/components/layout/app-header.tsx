"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-2">
         <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
            <path d="M12 22V12"></path>
            <path d="M20 12v5.5"></path>
            <path d="M4 12v5.5"></path>
            <path d="M12 2l-2.5 2.5"></path>
            <path d="M12 2l2.5 2.5"></path>
          </svg>
        <h1 className="text-xl font-semibold text-primary font-headline hidden sm:block">IntelliFix</h1>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
          <Link href="/agent">
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            AI Agent
          </Link>
        </Button>
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
