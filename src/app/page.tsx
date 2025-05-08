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
import { Separator } from "@/components/ui/separator";
import { PackageSearch, Layers, Archive, Settings, FileText } from 'lucide-react';
import type { CombinedQueryAnalysisResult } from '@/lib/actions/seeker-actions';
import type { GenerateOptimizedQueriesOutput } from '@/ai/flows/generate-optimized-queries';
import type { AnalyzeUserInputOutput } from '@/ai/flows/analyze-user-input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function SeekersLensPage() {
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
     toast({
      title: "Analysis Failed",
      description: errorMsg || "An unknown error occurred during analysis.",
      variant: "destructive",
    });
  }

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
                {/* Placeholder for Investigation Management */}
                <div className="space-y-3 text-sm">
                    <Button variant="outline" className="w-full justify-start text-muted-foreground">
                        <Archive className="mr-2 h-4 w-4" /> Current Project
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                        <FileText className="mr-2 h-4 w-4" /> Saved Queries
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                        <Settings className="mr-2 h-4 w-4" /> Knowledge Base
                    </Button>
                    <p className="text-xs text-muted-foreground p-2 text-center">
                        Full project management features coming soon.
                    </p>
                </div>
              </ScrollArea>
            </Card>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={30} className="p-1">
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={50} minSize={30} className="p-1">
                <Card className="h-full flex flex-col shadow-md">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-xl flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-primary" />AI-Powered Query Tools</CardTitle>
                     <CardDescription>Leverage AI to enhance your OSINT capabilities.</CardDescription>
                  </CardHeader>
                  <ScrollArea className="flex-grow p-4 pt-0">
                    <div className="space-y-6">
                      <QueryInputForm 
                        onAnalysisComplete={handleAnalysisComplete}
                        onAnalysisError={handleAnalysisError}
                        isLoading={isLoadingAnalysis}
                        setIsLoading={setIsLoadingAnalysis}
                      />
                      {analysisResult && (
                        <Card className="shadow-md">
                          <CardHeader>
                            <CardTitle className="text-md">Analysis Insights</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            {analysisResult.entities?.length > 0 && (
                              <div><strong>Entities:</strong> <span className="flex flex-wrap gap-1 mt-1">{analysisResult.entities.map(e => <Badge variant="secondary" key={e}>{e}</Badge>)}</span></div>
                            )}
                            {analysisResult.concepts?.length > 0 && (
                              <div><strong>Concepts:</strong> <span className="flex flex-wrap gap-1 mt-1">{analysisResult.concepts.map(c => <Badge variant="secondary" key={c}>{c}</Badge>)}</span></div>
                            )}
                            {analysisResult.informationNeeds && (
                              <div><strong>Information Needs:</strong> <p className="text-muted-foreground italic">{analysisResult.informationNeeds}</p></div>
                            )}
                             {analysisResult.querySuggestions?.length > 0 && (
                              <div><strong>Suggested Base Queries:</strong> <div className="space-y-1 mt-1">{analysisResult.querySuggestions.map(qs => <p className="font-mono text-xs p-1 bg-muted rounded" key={qs}>{qs}</p>)}</div></div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                      <Separator />
                      <HorizonExpansionForm />
                      <Separator />
                      <StrategicModulesForm />
                    </div>
                  </ScrollArea>
                </Card>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={30} className="p-1">
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
