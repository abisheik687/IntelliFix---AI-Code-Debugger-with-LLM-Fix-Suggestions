
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wand2, Lightbulb, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { explainError as genExplainError, ExplainErrorOutput } from '@/ai/flows/explain-error';
import { suggestFix as genSuggestFix, SuggestFixOutput } from '@/ai/flows/suggest-fix';
import { detectErrorIntent, type IntentDetectionOutput } from '@/ai/flows/intent-detection';
import { Skeleton } from "@/components/ui/skeleton";

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "typescript", label: "TypeScript" },
  { value: "cpp", label: "C++" },
];

interface RecentError {
  id: string;
  description: string;
  status: string;
  severity: 'High' | 'Medium' | 'Low';
  date: string; // YYYY-MM-DD
  type?: string; // e.g., 'Syntax', 'Logic'
  codeSnippet?: string; // Store the code for potential re-analysis or context
}

const MAX_RECENT_ERRORS = 20; // Increased limit for more data
const LOCAL_STORAGE_KEY = 'intellifix-recent-errors'; // Standardized key

const addErrorToHistory = (newErrorEntry: Omit<RecentError, 'id' | 'date'> & { type?: string }) => {
  try {
    const storedErrors = localStorage.getItem(LOCAL_STORAGE_KEY);
    let recentErrors: RecentError[] = storedErrors ? JSON.parse(storedErrors) : [];
    
    const errorWithDetails: RecentError = {
      ...newErrorEntry,
      id: `ERR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toISOString().split('T')[0],
    };

    recentErrors.unshift(errorWithDetails);
    recentErrors = recentErrors.slice(0, MAX_RECENT_ERRORS);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentErrors));
  } catch (error) {
    console.error("Failed to save error to history:", error);
  }
};


export default function DebuggerPage() {
  const [code, setCode] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [errorTrace, setErrorTrace] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [explanation, setExplanation] = useState<ExplainErrorOutput | null>(null);
  const [suggestedFix, setSuggestedFix] = useState<SuggestFixOutput | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isLoadingFix, setIsLoadingFix] = useState(false);
  const { toast } = useToast();

  const processAndLogError = async (status: string, currentCode: string, currentErrorTrace: string) => {
    let detectedIntent: string | undefined = undefined;
    if (currentCode && currentErrorTrace) {
      try {
        const intentResult = await detectErrorIntent({ codeSnippet: currentCode, errorTrace: currentErrorTrace });
        detectedIntent = intentResult.intent;
      } catch (intentError) {
        console.error("Error detecting intent:", intentError);
        // Do not toast here, as it might be too noisy. Log for dev purposes.
      }
    }
    addErrorToHistory({
      description: currentErrorTrace.substring(0, 100) + (currentErrorTrace.length > 100 ? "..." : ""),
      status: status,
      severity: "Medium", // Default severity, could be made dynamic later
      type: detectedIntent,
      codeSnippet: currentCode.substring(0, 200) + (currentCode.length > 200 ? "..." : ""),
    });
  };

  const handleExplainError = async () => {
    if (!code || !errorTrace) {
      toast({ title: "Missing Input", description: "Please provide both code and error trace.", variant: "destructive" });
      return;
    }
    setIsLoadingExplanation(true);
    setExplanation(null);
    const currentCode = code;
    const currentErrorTrace = errorTrace;
    try {
      const result = await genExplainError({ codeSnippet: currentCode, errorTrace: currentErrorTrace });
      setExplanation(result);
      await processAndLogError("Explained", currentCode, currentErrorTrace);
    } catch (error) {
      console.error("Error explaining:", error);
      toast({ title: "AI Error", description: "Could not get explanation from AI.", variant: "destructive" });
      await processAndLogError("Explain Failed", currentCode, currentErrorTrace);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const handleSuggestFix = async () => {
    if (!code || !errorTrace) {
      toast({ title: "Missing Input", description: "Please provide both code and error trace.", variant: "destructive" });
      return;
    }
    setIsLoadingFix(true);
    setSuggestedFix(null);
    setOriginalCode(code); 
    const currentCode = code;
    const currentErrorTrace = errorTrace;
    try {
      const result = await genSuggestFix({ code: currentCode, error: currentErrorTrace, language: selectedLanguage });
      setSuggestedFix(result);
      await processAndLogError("Fix Suggested", currentCode, currentErrorTrace);
    } catch (error) {
      console.error("Error suggesting fix:", error);
      toast({ title: "AI Error", description: "Could not get fix suggestion from AI.", variant: "destructive" });
      await processAndLogError("Suggest Failed", currentCode, currentErrorTrace);
    } finally {
      setIsLoadingFix(false);
    }
  };

  const handleApplyFix = async () => {
    if (suggestedFix?.fixedCode) {
      const currentCodeBeforeFix = code;
      const currentErrorTrace = errorTrace;
      setCode(suggestedFix.fixedCode);
      toast({ title: "Fix Applied", description: "The suggested fix has been applied to your code.",variant: "default" });
      // Log after applying the fix, using the original code and error trace for context
      await processAndLogError("Fix Applied", originalCode || currentCodeBeforeFix, currentErrorTrace);
    }
  };

  const handleRollback = () => {
    setCode(originalCode);
    setSuggestedFix(null); 
    toast({title: "Rollback Successful", description: "Original code has been restored."})
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setCode(fileContent);
        setOriginalCode(fileContent); 
        if (file.name.endsWith(".py")) setSelectedLanguage("python");
        else if (file.name.endsWith(".js")) setSelectedLanguage("javascript");
        else if (file.name.endsWith(".java")) setSelectedLanguage("java");
        else if (file.name.endsWith(".ts")) setSelectedLanguage("typescript");
        else if (file.name.endsWith(".go")) setSelectedLanguage("go");
        else if (file.name.endsWith(".cpp")) setSelectedLanguage("cpp");
      };
      reader.readAsText(file);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <Card className="flex-grow flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Code Input</CardTitle>
            <CardDescription>Enter your code snippet and select the language. You can also upload a file.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" /> Upload File
                </Label>
              </Button>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
            </div>
            <Textarea
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-grow min-h-[300px] font-code text-sm rounded-md shadow-inner bg-background focus:bg-background/90 resize-none"
              aria-label="Code input area"
            />
            <Label htmlFor="error-trace">Error Trace</Label>
            <Textarea
              id="error-trace"
              placeholder="Paste your error trace or console output here..."
              value={errorTrace}
              onChange={(e) => setErrorTrace(e.target.value)}
              className="h-[150px] font-code text-sm rounded-md shadow-inner bg-background focus:bg-background/90 resize-none"
              aria-label="Error trace input area"
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 flex flex-col">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">AI Assistance</CardTitle>
            <CardDescription>Get explanations and automated fixes for your code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleExplainError} className="w-full" disabled={isLoadingExplanation || isLoadingFix}>
              <Lightbulb className="mr-2 h-4 w-4" /> {isLoadingExplanation ? "Explaining..." : "Explain Error"}
            </Button>
            <Button onClick={handleSuggestFix} className="w-full" disabled={isLoadingExplanation || isLoadingFix}>
              <Wand2 className="mr-2 h-4 w-4" /> {isLoadingFix ? "Suggesting Fix..." : "Suggest Fix"}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-grow flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Output</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <Tabs defaultValue="explanation" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
                <TabsTrigger value="fix">Suggested Fix</TabsTrigger>
              </TabsList>
              <TabsContent value="explanation" className="flex-grow mt-2">
                <ScrollArea className="h-[calc(100vh-500px)] sm:h-[300px] rounded-md border p-4 bg-muted/20 shadow-inner">
                  {isLoadingExplanation && (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  )}
                  {explanation ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-primary">Explanation:</h4>
                        <p className="text-sm">{explanation.explanation}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary">Root Cause:</h4>
                        <p className="text-sm">{explanation.rootCause}</p>
                      </div>
                      {explanation.documentationLinks && explanation.documentationLinks.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary">Documentation:</h4>
                          <ul className="list-disc list-inside text-sm">
                            {explanation.documentationLinks.map((link, index) => (
                              <li key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                  Relevant Doc #{index + 1}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : !isLoadingExplanation && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <AlertCircle className="w-10 h-10 mb-2" />
                      <p>No explanation available yet. Click "Explain Error".</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="fix" className="flex-grow mt-2">
                 <ScrollArea className="h-[calc(100vh-500px)] sm:h-[300px] rounded-md border p-4 bg-muted/20 shadow-inner">
                   {isLoadingFix && (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  )}
                  {suggestedFix ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-primary">Suggested Code:</h4>
                          <Button variant="ghost" size="sm" onClick={() => {
                            navigator.clipboard.writeText(suggestedFix.fixedCode);
                            toast({title: "Copied!", description: "Suggested code copied to clipboard."});
                          }}>
                            <Copy className="mr-2 h-3 w-3" /> Copy
                          </Button>
                        </div>
                        <pre className="font-code text-xs bg-background p-2 rounded-md overflow-x-auto whitespace-pre-wrap">{suggestedFix.fixedCode}</pre>
                      </div>
                       <div>
                        <h4 className="font-semibold text-primary">Explanation of Fix:</h4>
                        <p className="text-sm">{suggestedFix.explanation}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleApplyFix} size="sm" disabled={!suggestedFix.fixedCode}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Apply Fix
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleRollback}>
                          Rollback
                        </Button>
                      </div>
                    </div>
                  ) : !isLoadingFix && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <AlertCircle className="w-10 h-10 mb-2" />
                      <p>No fix suggested yet. Click "Suggest Fix".</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

