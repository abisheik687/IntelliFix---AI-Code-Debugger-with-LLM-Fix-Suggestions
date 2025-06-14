
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, FileText, Activity, AlertTriangle, Bug } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies import("@/components/ui/chart").ChartConfig;

const pieChartData = [
  { name: 'Syntax Errors', value: 400, fill: "hsl(var(--chart-1))" },
  { name: 'Logic Errors', value: 300, fill: "hsl(var(--chart-2))" },
  { name: 'API Misuse', value: 300, fill: "hsl(var(--chart-3))" },
  { name: 'Semantic Errors', value: 200, fill: "hsl(var(--chart-4))" },
];

const recentErrors = [
  { id: "ERR001", description: "NullPointerException in UserServi...", status: "Open", severity: "High", date: "2024-07-28" },
  { id: "ERR002", description: "TypeError: 'NoneType' object is not iterable", status: "Fixed", severity: "Medium", date: "2024-07-27" },
  { id: "ERR003", description: "IndexOutOfBoundsException: Index 10 out of bounds for length 5", status: "Open", severity: "High", date: "2024-07-28" },
  { id: "ERR004", description: "Network Error: Failed to fetch resource", status: "Investigating", severity: "Low", date: "2024-07-26" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [clientUser, setClientUser] = useState<typeof user>(null);

  useEffect(() => {
    setClientUser(user);
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {clientUser?.name || "User"}! Here's an overview of your debugging activity.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors Fixed</CardTitle>
            <Bug className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+10.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fix Accuracy</CardTitle>
            <Activity className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Critical Errors</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Needs immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Error Trends
            </CardTitle>
            <CardDescription>Monthly error reports by type.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <Bar data={chartData} layout="vertical" stackId="a">
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </Bar>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-accent" />
              Error Type Distribution
            </CardTitle>
            <CardDescription>Breakdown of error types encountered.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <ChartContainer config={{}} className="h-full w-full aspect-square">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                     {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Recent Error History</CardTitle>
          <CardDescription>A log of the most recent errors processed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentErrors.map((error) => (
                <TableRow key={error.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{error.id}</TableCell>
                  <TableCell>{error.description}</TableCell>
                  <TableCell>
                     <span className={`px-2 py-1 text-xs rounded-full ${
                        error.status === 'Open' ? 'bg-destructive/20 text-destructive' :
                        error.status === 'Fixed' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                        'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                      {error.status}
                    </span>
                  </TableCell>
                  <TableCell className={error.severity === "High" ? "text-destructive" : error.severity === "Medium" ? "text-yellow-600 dark:text-yellow-500" : ""}>
                    {error.severity}
                  </TableCell>
                  <TableCell>{error.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
