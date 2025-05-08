
"use client";

import type * as React from 'react';
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, XCircle } from "lucide-react";
import type { CombinedQueryAnalysisResult } from '@/lib/actions/seeker-actions';

interface QueryInputFormProps {
  value: string;
  onValueChange: (value: string) => void;
  onAnalysisComplete: (results: CombinedQueryAnalysisResult) => void;
  onAnalysisError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function QueryInputForm({ 
  value, 
  onValueChange, 
  onAnalysisComplete, 
  onAnalysisError, 
  isLoading, 
  setIsLoading 
}: QueryInputFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Please enter a query or data to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { performIntelligentAnalysisAndQueryGeneration } = await import('@/lib/actions/seeker-actions');
      const results = await performIntelligentAnalysisAndQueryGeneration(value);
      onAnalysisComplete(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      let friendlyMessage = "An unexpected error occurred during analysis. Please try again.";
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("network")) {
        friendlyMessage = "Analysis failed due to a network issue. Please check your connection and try again.";
      } else if (errorMessage.toLowerCase().includes("invalid input")) {
        friendlyMessage = "Analysis failed due to invalid input. Please check your query and try again.";
      } else if (errorMessage.toLowerCase().includes("failed to perform intelligent analysis")) {
         friendlyMessage = "The AI could not process your request. Please try rephrasing your input.";
      }
      setError(friendlyMessage);
      onAnalysisError(errorMessage); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Intelligent Query Analysis</CardTitle>
        <CardDescription>Enter natural language, URLs, or structured data to extract insights and generate optimized search queries.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userInput">Your Input</Label>
            <div className="relative">
              <Textarea
                id="userInput"
                placeholder="e.g., 'Find information about Project Aurora activities in New York involving Cyberdyne Systems.'"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                rows={5}
                className="min-h-[100px] font-mono text-sm pr-10" 
                disabled={isLoading}
              />
              {value && !isLoading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => onValueChange("")}
                  aria-label="Clear input"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !value.trim()} className="w-full">
            {isLoading ? <Loader className="mr-2" /> : null}
            Analyze & Generate Queries
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
