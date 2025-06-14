
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Home,
  Settings,
  Bug,
  Bot,
  FileText,
  GitMerge,
  Brain,
  TestTube2,
  Users,
  LayoutDashboard,
  Code2,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/debugger", label: "Debugger", icon: Bug },
  { href: "/agent", label: "AI Agent", icon: Bot },
  {
    label: "Advanced Tools",
    icon: Settings,
    isGroup: true,
    subItems: [
      { href: "/sandbox", label: "Error Sandbox", icon: TestTube2, disabled: true },
      { href: "/code-converter", label: "Code Converter", icon: GitMerge, disabled: true },
      { href: "/multiplayer", label: "Collaboration", icon: Users, disabled: true },
    ],
  },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-2 border-b">
        <div className="flex items-center gap-2 p-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
            <path d="M12 22V12"></path>
            <path d="M20 12v5.5"></path>
            <path d="M4 12v5.5"></path>
            <path d="M12 2l-2.5 2.5"></path>
            <path d="M12 2l2.5 2.5"></path>
          </svg>
          <span className="font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden font-headline">
            IntelliFix
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) =>
            item.isGroup ? (
              <SidebarGroup key={item.label}>
                <SidebarGroupLabel className="flex items-center">
                  <item.icon className="mr-2" />
                  {item.label}
                </SidebarGroupLabel>
                <SidebarMenuSub>
                  {item.subItems?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.href}>
                      <Link href={subItem.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.href}
                          className={cn(subItem.disabled && "text-muted-foreground cursor-not-allowed opacity-50")}
                          aria-disabled={subItem.disabled}
                          tabIndex={subItem.disabled ? -1 : undefined}
                          onClick={(e) => subItem.disabled && e.preventDefault()}
                        >
                          <>
                            <subItem.icon className="mr-2" />
                            <span>{subItem.label}</span>
                          </>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarGroup>
            ) : (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: "right", align: "center" }}
                    className={cn(item.disabled && "text-muted-foreground cursor-not-allowed opacity-50")}
                    aria-disabled={item.disabled}
                    tabIndex={item.disabled ? -1 : undefined}
                     onClick={(e) => item.disabled && e.preventDefault()}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button variant="outline" className="w-full group-data-[collapsible=icon]:hidden">
          <Share2 className="mr-2 h-4 w-4" /> Share Feedback
        </Button>
         <Button variant="ghost" size="icon" className="hidden group-data-[collapsible=icon]:flex mx-auto">
            <Share2 />
            <span className="sr-only">Share Feedback</span>
          </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
