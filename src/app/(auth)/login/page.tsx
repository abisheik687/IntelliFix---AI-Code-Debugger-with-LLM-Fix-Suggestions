"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Github } from "lucide-react";
import { useAuth } from '@/lib/auth'; // Import useAuth

export default function LoginPage() {
  const { login, loading } = useAuth();

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
            <path d="M12 22V12"></path>
            <path d="M20 12v5.5"></path>
            <path d="M4 12v5.5"></path>
            <path d="M12 2l-2.5 2.5"></path>
            <path d="M12 2l2.5 2.5"></path>
          </svg>
        </div>
        <CardTitle className="text-3xl font-headline text-primary">IntelliFix</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to access your AI Code Debugger</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full border-primary/50 hover:bg-primary/10"
          onClick={() => login('google')}
          disabled={loading}
        >
          <Chrome className="mr-2 h-5 w-5 text-primary" />
          Sign in with Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-primary/50 hover:bg-primary/10"
          onClick={() => login('github')}
          disabled={loading}
        >
          <Github className="mr-2 h-5 w-5 text-primary" />
          Sign in with GitHub
        </Button>
        {loading && <p className="text-center text-sm text-muted-foreground">Signing in...</p>}
      </CardContent>
    </Card>
  );
}
