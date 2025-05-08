"use client";

import type * as React from 'react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StrategicQueryOutput } from '@/ai/flows/strategic-query-modules';
import { QueryDisplayCard } from './query-display-card';

interface StrategicModulesFormProps {
  // This component will manage its own state for now
}

const OSINT_OBJECTIVES = [
  "Digital Footprint Mapping",
  "Vulnerability Probing (Ethical Dorking)",
  "Metadata Discovery",
  "Archival & Historical Search",
  "Social Media Intelligence (SOCMINT)",
  "Supply Chain Analysis",
  "Reputation Monitoring",
];

export function StrategicModulesForm({}: StrategicModulesFormProps) {
  const [objective, setObjective] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [results, setResults] = useState<StrategicQueryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective) {
      setError("Please select an OSINT objective.");
      return;
    }
    if (!context.trim()) {
      setError("Please provide some context for the investigation.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const { performGenerateStrategicQueries } = await import('@/lib/actions/seeker-actions');
      const data = await performGenerateStrategicQueries(objective, context);
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
        <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/> Strategic Query Modules</CardTitle>
        <CardDescription>Generate query sets for specific OSINT objectives. Adaptable to your investigation context.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="osintObjective">OSINT Objective</Label>
            <Select value={objective} onValueChange={setObjective} disabled={isLoading}>
              <SelectTrigger id="osintObjective">
                <SelectValue placeholder="Select an objective" />
              </SelectTrigger>
              <SelectContent>
                {OSINT_OBJECTIVES.map((obj) => (
                  <SelectItem key={obj} value={obj}>{obj}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Investigation Context/Keywords</Label>
            <Input
              id="context"
              placeholder="e.g., 'Acme Corp acquisitions', 'vulnerabilities in webserver X'"
              value={context}
              onChange={(e) => setContext(e.target.value)}
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
            Generate Strategic Queries
          </Button>
        </CardFooter>
      </form>
      {results && (
        <CardContent className="mt-4 border-t pt-4">
            <QueryDisplayCard 
                title="Generated Strategic Queries"
                queries={results.queries || []}
                isLoading={isLoading}
            />
        </CardContent>
      )}
    </Card>
  );
}
