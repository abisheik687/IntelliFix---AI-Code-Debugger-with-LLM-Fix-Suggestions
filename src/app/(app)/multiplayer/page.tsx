
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function MultiplayerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Collaboration</h1>
        <Users className="h-8 w-8 text-primary" />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Collaboration Tools</CardTitle>
          <CardDescription>
            Work together with your team on debugging and coding tasks in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Team features are being built!</p>
        </CardContent>
      </Card>
    </div>
  );
}
