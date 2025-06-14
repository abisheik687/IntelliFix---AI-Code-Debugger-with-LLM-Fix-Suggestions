
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wand2, Lightbulb, GitDiff, Undo, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { explainError as genExplainError, ExplainErrorOutput } from '@/ai/flows/explain-error';
import { suggestFix as genSuggestFix, SuggestFixOutput } from '@/ai/flows/suggest-fix';
import { Skeleton } from "@/components/ui/skeleton";

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "typescript", label: "TypeScript" },
  { value: "cpp", label: "C++" },
];

export default function DebuggerPage() {
  const [code, setCode] = useState("");
  const [errorTrace, setErrorTrace] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [explanation, setExplanation] = useState<ExplainErrorOutput | null>(null);
  const [suggestedFix, setSuggestedFix] = useState<SuggestFixOutput | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isLoadingFix, setIsLoadingFix] = useState(false);
  const { toast } = useToast();

  const handleExplainError = async () => {
    if (!code || !errorTrace) {
      toast({ title: "Missing Input", description: "Please provide both code and error trace.", variant: "destructive" });
      return;
    }
    setIsLoadingExplanation(true);
    setExplanation(null);
    try {
      const result = await genExplainError({ codeSnippet: code, errorTrace });
      setExplanation(result);
    } catch (error) {
      console.error("Error explaining:", error);
      toast({ title: "AI Error", description: "Could not get explanation from AI.", variant: "destructive" });
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
    try {
      const result = await genSuggestFix({ code, error: errorTrace, language: selectedLanguage });
      setSuggestedFix(result);
    } catch (error) {
      console.error("Error suggesting fix:", error);
      toast({ title: "AI Error", description: "Could not get fix suggestion from AI.", variant: "destructive" });
    } finally {
      setIsLoadingFix(false);
    }
  };

  const handleApplyFix = () => {
    if (suggestedFix?.fixedCode) {
      setCode(suggestedFix.fixedCode);
      toast({ title: "Fix Applied", description: "The suggested fix has been applied to your code.",variant: "default" });
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target?.result as string);
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
      {/* Code and Error Input Column */}
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

      {/* AI Actions and Output Column */}
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
                        <h4 className="font-semibold text-primary">Suggested Code:</h4>
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
                        <Button variant="outline" size="sm" onClick={() => {
                            setCode(code); 
                            toast({title: "Rollback (Mock)", description: "Original code restored (mock action)."})
                        }}>
                          <Undo className="mr-2 h-4 w-4" /> Rollback
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
