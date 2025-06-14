"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Code2, Send, Sparkles, MessageSquare, PencilRuler } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { aiPairProgrammingAgent, AIPairProgrammingAgentOutput } from "@/ai/flows/ai-pair-programming-agent";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  // Add other languages as needed
];

const commentTones = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "sarcastic", label: "Sarcastic (for fun!)" },
  { value: "concise", label: "Concise" },
];

export default function AgentPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [codeAssistInput, setCodeAssistInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [selectedTone, setSelectedTone] = useState(commentTones[0].value);
  const [promptContext, setPromptContext] = useState("");
  const [aiResponse, setAiResponse] = useState<AIPairProgrammingAgentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: chatInput,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newUserMessage]);
    
    // Simulate AI response for chat
    setIsLoading(true);
    setTimeout(() => {
      const aiChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: `I received your message: "${chatInput}". How can I help you debug or understand your code?`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiChatMessage]);
      setIsLoading(false);
    }, 1000);
    setChatInput("");
  };

  const handleCodeAssistSubmit = async () => {
    if (!codeAssistInput.trim()) {
      toast({ title: "Input Required", description: "Please enter some code to assist with.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    try {
      const result = await aiPairProgrammingAgent({
        code: codeAssistInput,
        language: selectedLanguage,
        tone: selectedTone,
        promptContext: promptContext,
      });
      setAiResponse(result);
      // For demonstration, let's update the code input with commented code
      if (result.commentedCode) {
        setCodeAssistInput(result.commentedCode);
      }
    } catch (error) {
      console.error("AI Agent Error:", error);
      toast({ title: "AI Error", description: "Could not get assistance from AI agent.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Pair Programming Agent</h1>
        <Sparkles className="h-8 w-8 text-accent" />
      </div>

      <Tabs defaultValue="code-assist" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code-assist"><PencilRuler className="mr-2 h-4 w-4 inline-block" />Code Assist</TabsTrigger>
          <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4 inline-block" />Chat Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="code-assist" className="mt-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Code2 className="mr-2 h-6 w-6 text-primary" />Code Assistance</CardTitle>
              <CardDescription>Get auto-commenting and predictive typing suggestions. The AI remembers your coding style and context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language-select">Programming Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger id="language-select">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tone-select">Comment Tone</Label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger id="tone-select">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {commentTones.map(tone => <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="prompt-context">Prompt Context (Optional)</Label>
                <Input 
                  id="prompt-context" 
                  placeholder="e.g., 'Refactoring user authentication module'" 
                  value={promptContext}
                  onChange={(e) => setPromptContext(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="code-assist-input">Your Code</Label>
                <Textarea
                  id="code-assist-input"
                  placeholder="Paste your code here for assistance..."
                  value={codeAssistInput}
                  onChange={(e) => setCodeAssistInput(e.target.value)}
                  className="min-h-[250px] font-code text-sm rounded-md shadow-inner bg-background focus:bg-background/90"
                />
              </div>
              <Button onClick={handleCodeAssistSubmit} className="w-full" disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" /> {isLoading ? "Processing..." : "Get AI Assistance"}
              </Button>
              
              {isLoading && !aiResponse && (
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}

              {aiResponse && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Commented Code:</h3>
                    <ScrollArea className="h-[200px] mt-2 rounded-md border p-2 bg-muted/20">
                      <pre className="font-code text-sm whitespace-pre-wrap">{aiResponse.commentedCode}</pre>
                    </ScrollArea>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Predictive Typing Suggestions:</h3>
                    {aiResponse.predictiveTypingSuggestions && aiResponse.predictiveTypingSuggestions.length > 0 ? (
                      <ul className="list-disc list-inside mt-2 pl-2">
                        {aiResponse.predictiveTypingSuggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm font-code p-1 bg-background rounded hover:bg-muted/50 cursor-pointer" onClick={() => {
                            setCodeAssistInput(prev => prev + suggestion);
                            toast({title: "Suggestion Applied", description: `Added: ${suggestion}`});
                          }}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">No typing suggestions available for this input.</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card className="shadow-lg h-[calc(100vh-280px)] md:h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center"><Bot className="mr-2 h-6 w-6 text-primary" />AI Chat</CardTitle>
              <CardDescription>Chat with the AI agent for debugging help, code explanations, or general programming queries.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden flex flex-col">
              <ScrollArea className="flex-grow pr-4 -mr-4 mb-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.sender === "ai" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3 text-sm shadow",
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {msg.content}
                         <p className={cn("text-xs mt-1", msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70')}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {msg.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                   {isLoading && chatMessages.length > 0 && chatMessages[chatMessages.length -1].sender === 'user' && (
                     <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                        <div className="max-w-[70%] rounded-lg p-3 text-sm shadow bg-muted text-muted-foreground">
                          <div className="flex space-x-1">
                            <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-primary/50 rounded-full animate-bounce"></span>
                          </div>
                        </div>
                      </div>
                   )}
                </div>
              </ScrollArea>
              <div className="flex items-center gap-2 pt-4 border-t">
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendChatMessage()}
                  className="flex-grow"
                />
                <Button onClick={handleSendChatMessage} disabled={isLoading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
