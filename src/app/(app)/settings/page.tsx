"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit3, Key, Palette, Save, UserCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user) {
      setDisplayName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call for profile update
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <Card><CardHeader><CardTitle>Loading settings...</CardTitle></CardHeader></Card>
      </div>
    );
  }

  if (!user) {
    return (
       <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <Card><CardHeader><CardTitle>Please log in to view settings.</CardTitle></CardHeader></Card>
      </div>
    );
  }


  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><UserCircle2 className="mr-2 h-6 w-6 text-primary" /> Profile Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar"/>
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Edit3 className="mr-2 h-4 w-4" /> Change Avatar
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
               <p className="text-xs text-muted-foreground">Email address cannot be changed through this interface.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="role">Current Role</Label>
              <Input id="role" value={user.role} disabled className="font-medium" />
            </div>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" /> Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Key className="mr-2 h-6 w-6 text-primary" /> API Key Management</CardTitle>
          <CardDescription>Manage API keys for enterprise users (feature placeholder).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.role === 'Admin' || user.role === 'Contributor' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="apiKey">Your API Key</Label>
                <div className="flex items-center gap-2">
                  <Input id="apiKey" value="************************abcd" readOnly />
                  <Button variant="outline" size="sm">Copy</Button>
                </div>
                 <p className="text-xs text-muted-foreground">Keep your API key secure. Do not share it publicly.</p>
              </div>
              <Button variant="secondary">
                Regenerate API Key
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">API key management is available for Contributor and Admin roles. Contact support to upgrade your plan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
