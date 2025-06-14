
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Activity, AlertTriangle, Bug, BarChart as BarChartIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { format } from "date-fns";

// Matches the interface in debugger/page.tsx
interface RecentError {
  id: string;
  description: string;
  status: string;
  severity: 'High' | 'Medium' | 'Low';
  date: string; // YYYY-MM-DD
  type?: string; 
}

const LOCAL_STORAGE_KEY = 'intellifix-recent-errors'; // Standardized key

interface MonthlyErrorData {
  month: string; // e.g., "July 2024"
  count: number;
}

interface ErrorTypeData {
  name: string;
  value: number;
  fill: string;
}

const PIE_CHART_COLORS: { [key: string]: string } = {
  'Syntax': "hsl(var(--chart-1))",
  'Logic': "hsl(var(--chart-2))",
  'API misuse': "hsl(var(--chart-3))",
  'Semantic': "hsl(var(--chart-4))",
  'Other': "hsl(var(--chart-5))", // Fallback color
};


export default function DashboardPage() {
  const { user } = useAuth();
  const [clientUser, setClientUser] = useState<typeof user>(null);
  const [recentErrors, setRecentErrors] = useState<RecentError[]>([]);
  const [monthlyErrorData, setMonthlyErrorData] = useState<MonthlyErrorData[]>([]);
  const [errorTypeDistributionData, setErrorTypeDistributionData] = useState<ErrorTypeData[]>([]);
  const [totalErrorsFixed, setTotalErrorsFixed] = useState(0);

  useEffect(() => {
    setClientUser(user);
  }, [user]);

  useEffect(() => {
    try {
      const storedErrors = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedErrors) {
        const parsedErrors: RecentError[] = JSON.parse(storedErrors);
        setRecentErrors(parsedErrors);

        // Calculate total errors fixed
        const fixedCount = parsedErrors.filter(error => error.status === 'Fix Applied').length;
        setTotalErrorsFixed(fixedCount);

        // Process for Error Trends (Monthly)
        const monthlyCounts: { [key: string]: number } = {};
        parsedErrors.forEach(error => {
          try {
            const monthYear = format(new Date(error.date), "MMMM yyyy");
            monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
          } catch (e) {
            // console.warn("Could not parse date for error trend:", error.date, e);
          }
        });
        const processedMonthlyData = Object.entries(monthlyCounts)
          .map(([month, count]) => ({ month, count }))
          .sort((a,b) => new Date(a.month).getTime() - new Date(b.month).getTime()); // Sort chronologically
        setMonthlyErrorData(processedMonthlyData);

        // Process for Error Type Distribution
        const typeCounts: { [key: string]: number } = {};
        parsedErrors.forEach(error => {
          const errorType = error.type || 'Other';
          typeCounts[errorType] = (typeCounts[errorType] || 0) + 1;
        });
        const processedPieData = Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value,
          fill: PIE_CHART_COLORS[name] || PIE_CHART_COLORS['Other'],
        }));
        setErrorTypeDistributionData(processedPieData);

      }
    } catch (error) {
      console.error("Failed to load or process recent errors from localStorage:", error);
      setRecentErrors([]); 
      setMonthlyErrorData([]);
      setErrorTypeDistributionData([]);
      setTotalErrorsFixed(0);
    }
  }, []);

  const barChartConfig = {
    count: { label: "Errors", color: "hsl(var(--chart-1))" },
  } satisfies import("@/components/ui/chart").ChartConfig;


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
            <div className="text-3xl font-bold">{totalErrorsFixed}</div>
            <p className="text-xs text-muted-foreground">Number of fixes applied by IntelliFix.</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fix Accuracy</CardTitle>
            <Activity className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Accuracy data not yet available.</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Critical Errors</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Criticality data not yet available.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChartIcon className="mr-2 h-5 w-5 text-primary" />
              Error Trends
            </CardTitle>
            <CardDescription>Monthly error reports.</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyErrorData.length > 0 ? (
              <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyErrorData} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" dataKey="count" allowDecimals={false} />
                    <YAxis dataKey="month" type="category" tickLine={false} tickMargin={10} axisLine={false} width={80} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-center py-10">No error trend data available yet. Process some errors in the Debugger.</p>
            )}
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
            {errorTypeDistributionData.length > 0 ? (
              <ChartContainer config={{}} className="h-full w-full aspect-square">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={errorTypeDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {errorTypeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
               <p className="text-muted-foreground text-center py-10">No error type data available. Ensure errors are processed and types are detected in the Debugger.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Recent Error History</CardTitle>
          <CardDescription>A log of the most recent errors processed.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentErrors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Error ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentErrors.map((error) => (
                  <TableRow key={error.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{error.id.substring(0,10)}...</TableCell>
                    <TableCell>{error.description}</TableCell>
                    <TableCell>{error.type || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                          error.status.includes('Failed') ? 'bg-destructive/20 text-destructive' :
                          error.status === 'Fix Applied' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                          error.status === 'Fix Suggested' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                          error.status === 'Explained' ? 'bg-sky-500/20 text-sky-700 dark:text-sky-400' :
                          'bg-muted'
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
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent errors processed. Use the Debugger to analyze errors.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

