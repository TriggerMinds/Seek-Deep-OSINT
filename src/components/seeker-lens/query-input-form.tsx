"use client";

import type * as React from 'react';
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import type { CombinedQueryAnalysisResult } from '@/lib/actions/seeker-actions';

interface QueryInputFormProps {
  onAnalysisComplete: (results: CombinedQueryAnalysisResult) => void;
  onAnalysisError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function QueryInputForm({ onAnalysisComplete, onAnalysisError, isLoading, setIsLoading }: QueryInputFormProps) {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // This action will be imported and called. For now, placeholder.
  // import { performIntelligentAnalysisAndQueryGeneration } from '@/lib/actions/seeker-actions';


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError("Please enter a query or data to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Dynamically import the server action
      const { performIntelligentAnalysisAndQueryGeneration } = await import('@/lib/actions/seeker-actions');
      const results = await performIntelligentAnalysisAndQueryGeneration(userInput);
      onAnalysisComplete(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
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
            <Textarea
              id="userInput"
              placeholder="e.g., 'Find information about Project Aurora activities in New York involving Cyberdyne Systems.'"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={5}
              className="min-h-[100px] font-mono text-sm"
              disabled={isLoading}
            />
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
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader className="mr-2" /> : null}
            Analyze & Generate Queries
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
