"use client";

import type * as React from 'react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Lightbulb } from "lucide-react";
import type { SuggestRelatedTermsOutput } from '@/ai/flows/suggest-related-terms';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface HorizonExpansionFormProps {
  // This component will manage its own state for now to simplify page.tsx
}

export function HorizonExpansionForm({}: HorizonExpansionFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SuggestRelatedTermsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const { performSuggestRelatedTerms } = await import('@/lib/actions/seeker-actions');
      const data = await performSuggestRelatedTerms(searchTerm);
      setResults(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary" /> Proactive Horizon Expansion</CardTitle>
        <CardDescription>Discover related terms and alternative search strategies to broaden your investigation.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchTerm">Initial Search Term</Label>
            <Input
              id="searchTerm"
              placeholder="e.g., 'dark patterns social media'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            Suggest Terms & Strategies
          </Button>
        </CardFooter>
      </form>
      {results && (
        <CardContent className="mt-4 border-t pt-4">
          <ScrollArea className="h-[200px] pr-2"> {/* Adjust height as needed */}
            {results.relatedTerms?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm">Related Terms:</h4>
                <div className="flex flex-wrap gap-2">
                  {results.relatedTerms.map((term, index) => (
                    <Badge key={`term-${index}`} variant="secondary">{term}</Badge>
                  ))}
                </div>
              </div>
            )}
            {results.alternativeStrategies?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">Alternative Strategies:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {results.alternativeStrategies.map((strategy, index) => (
                    <li key={`strategy-${index}`}>{strategy}</li>
                  ))}
                </ul>
              </div>
            )}
             {(!results.relatedTerms || results.relatedTerms.length === 0) && (!results.alternativeStrategies || results.alternativeStrategies.length === 0) && (
                <p className="text-sm text-muted-foreground">No suggestions found for this term.</p>
             )}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
