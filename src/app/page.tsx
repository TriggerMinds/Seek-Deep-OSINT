"use client";

import { useState } from 'react';
import { Header } from "@/components/layout/header";
import { QueryInputForm } from "@/components/seeker-lens/query-input-form";
import { GeneratedQueriesDisplay } from "@/components/seeker-lens/generated-queries-display";
import { HorizonExpansionForm } from "@/components/seeker-lens/horizon-expansion-form";
import { StrategicModulesForm } from "@/components/seeker-lens/strategic-modules-form";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PackageSearch, Layers, Archive, Settings, FileText, Lightbulb, Target } from 'lucide-react';
import type { CombinedQueryAnalysisResult } from '@/lib/actions/seeker-actions';
import type { GenerateOptimizedQueriesOutput } from '@/ai/flows/generate-optimized-queries';
import type { AnalyzeUserInputOutput } from '@/ai/flows/analyze-user-input';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

export default function SeekersLensPage() {
  const [userInput, setUserInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzeUserInputOutput | null>(null);
  const [optimizedQueries, setOptimizedQueries] = useState<GenerateOptimizedQueriesOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const { toast } = useToast();

  const handleAnalysisComplete = (results: CombinedQueryAnalysisResult) => {
    setAnalysisResult(results.analysis);
    setOptimizedQueries(results.optimizedQueries);
    toast({
      title: "Analysis Complete",
      description: "Queries generated successfully.",
    });
  };

  const handleAnalysisError = (errorMsg: string) => {
    let friendlyMessage = "An unexpected error occurred. Please try again.";
    if (errorMsg.includes("Failed to fetch") || errorMsg.includes("network")) {
      friendlyMessage = "Analysis failed due to a network issue. Please check your connection and try again.";
    } else if (errorMsg.toLowerCase().includes("invalid input")) {
      friendlyMessage = "Analysis failed due to invalid input. Please check your query and try again.";
    }  else if (errorMsg.toLowerCase().includes("failed to perform intelligent analysis")) {
      friendlyMessage = "The AI could not process your request. Please try rephrasing your input.";
    } else if (errorMsg.toLowerCase().includes("failed to suggest related terms")) {
      friendlyMessage = "The AI could not find related terms for your input. Please try a different term.";
    } else if (errorMsg.toLowerCase().includes("failed to generate strategic queries")) {
      friendlyMessage = "The AI could not generate strategic queries for your input. Please try adjusting the objective or context.";
    }
    toast({
      title: "Analysis Failed",
      description: friendlyMessage,
      variant: "destructive",
    });
  }

  const handleInteractiveTermClick = (term: string) => {
    setUserInput(term);
    // Consider finding the Tabs component and programmatically changing its value to 'analyze'
    // For now, just populating the input for QueryInputForm.
    // If tabs are implemented, ensure this interaction switches to the "Analyze & Generate" tab.
  };


  return (
    <div className="flex flex-col h-screen bg-muted/20 dark:bg-muted/40">
      <Header />
      <main className="flex-grow overflow-hidden p-1 md:p-2">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border shadow-sm bg-background">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="p-1">
            <Card className="h-full flex flex-col shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center"><Layers className="mr-2 h-5 w-5 text-primary" />Investigations</CardTitle>
                <CardDescription>Manage your OSINT projects.</CardDescription>
              </CardHeader>
              <ScrollArea className="flex-grow p-4 pt-0">
                <TooltipProvider>
                  <div className="space-y-3 text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-muted-foreground" disabled>
                          <Archive className="mr-2 h-4 w-4" /> Current Project
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Feature coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                          <FileText className="mr-2 h-4 w-4" /> Saved Queries
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Feature coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                          <Settings className="mr-2 h-4 w-4" /> Knowledge Base
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Feature coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                    <p className="text-xs text-muted-foreground p-2 text-center">
                      Full project management features coming soon.
                    </p>
                  </div>
                </TooltipProvider>
              </ScrollArea>
            </Card>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={30} className="p-1">
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={60} minSize={30} className="p-1"> {/* Panel for AI Tools */}
                <Card className="flex flex-col shadow-md h-full"> {/* Card fills this panel */}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-primary" />AI-Powered Query Tools</CardTitle>
                    <CardDescription>Leverage AI to enhance your OSINT capabilities.</CardDescription>
                  </CardHeader>
                  {/* CardContent now directly contains Tabs, allowing Tabs to manage height and scrolling */}
                  <CardContent className="p-4 pt-2 flex-grow flex flex-col overflow-hidden">
                    <Tabs defaultValue="analyze" className="flex flex-col flex-grow h-full"> {/* Tabs fills CardContent */}
                      <TabsList className="grid w-full grid-cols-3 mb-2">
                        <TabsTrigger value="analyze" className="flex items-center gap-2">
                          <PackageSearch className="h-4 w-4" /> Analyze &amp; Generate
                        </TabsTrigger>
                        <TabsTrigger value="expand" className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" /> Expand Horizon
                        </TabsTrigger>
                        <TabsTrigger value="strategic" className="flex items-center gap-2">
                          <Target className="h-4 w-4" /> Strategic Modules
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* Each TabsContent will grow and scroll internally if needed */}
                      <TabsContent value="analyze" className="mt-2 flex-grow overflow-y-auto p-1">
                         <div className="space-y-6">
                            <QueryInputForm
                                value={userInput}
                                onValueChange={setUserInput}
                                onAnalysisComplete={handleAnalysisComplete}
                                onAnalysisError={handleAnalysisError}
                                isLoading={isLoadingAnalysis}
                                setIsLoading={setIsLoadingAnalysis}
                              />
                              {analysisResult && (
                                <Card className="shadow-inner mt-4"> {/* Added mt-4 for spacing */}
                                  <CardHeader className="py-3">
                                    <CardTitle className="text-md">Analysis Insights</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3 text-sm pt-0 pb-4">
                                    {analysisResult.entities?.length > 0 && (
                                      <div><strong>Entities:</strong> <span className="flex flex-wrap gap-1 mt-1">{analysisResult.entities.map(e => (
                                        <Button key={e} variant="secondary" size="sm" className="h-auto px-2 py-0.5 text-xs" onClick={() => handleInteractiveTermClick(e)}>
                                          {e}
                                        </Button>
                                      ))}</span></div>
                                    )}
                                    {analysisResult.concepts?.length > 0 && (
                                      <div><strong>Concepts:</strong> <span className="flex flex-wrap gap-1 mt-1">{analysisResult.concepts.map(c => (
                                        <Button key={c} variant="secondary" size="sm" className="h-auto px-2 py-0.5 text-xs" onClick={() => handleInteractiveTermClick(c)}>
                                          {c}
                                        </Button>
                                      ))}</span></div>
                                    )}
                                    {analysisResult.informationNeeds && (
                                      <div><strong>Information Needs:</strong> <p className="text-muted-foreground italic mt-1">{analysisResult.informationNeeds}</p></div>
                                    )}
                                    {analysisResult.querySuggestions?.length > 0 && (
                                      <div><strong>Suggested Base Queries:</strong> <div className="space-y-1 mt-1">{analysisResult.querySuggestions.map(qs => (
                                        <Button key={qs} variant="link" className="font-mono text-xs p-1 h-auto block text-left text-primary hover:underline" onClick={() => handleInteractiveTermClick(qs)}>
                                          {qs}
                                        </Button>
                                      ))}</div></div>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                         </div>
                      </TabsContent>

                      <TabsContent value="expand" className="mt-2 flex-grow overflow-y-auto p-1">
                        <HorizonExpansionForm onTermClick={handleInteractiveTermClick} />
                      </TabsContent>

                      <TabsContent value="strategic" className="mt-2 flex-grow overflow-y-auto p-1">
                         <StrategicModulesForm />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={20} className="p-1"> {/* Panel for Generated Queries */}
                <GeneratedQueriesDisplay
                  queriesData={optimizedQueries}
                  isLoading={isLoadingAnalysis}
                  className="h-full" 
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}

