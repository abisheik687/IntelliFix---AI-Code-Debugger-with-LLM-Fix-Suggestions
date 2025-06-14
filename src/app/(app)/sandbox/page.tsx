
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube2 } from "lucide-react";

export default function SandboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Error Sandbox</h1>
        <TestTube2 className="h-8 w-8 text-primary" />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Error Sandbox</CardTitle>
          <CardDescription>
            Experiment with code snippets in a safe, isolated environment to understand errors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Come back later to test your code safely!</p>
        </CardContent>
      </Card>
    </div>
  );
}
