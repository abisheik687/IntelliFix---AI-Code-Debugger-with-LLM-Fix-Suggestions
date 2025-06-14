
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitMerge } from "lucide-react";

export default function CodeConverterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Code Converter</h1>
        <GitMerge className="h-8 w-8 text-primary" />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Code Converter</CardTitle>
          <CardDescription>
            Convert code snippets between different programming languages using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Language conversion magic coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
