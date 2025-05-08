"use client";

import type { GenerateOptimizedQueriesOutput } from "@/ai/flows/generate-optimized-queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";

interface GeneratedQueriesDisplayProps {
  queriesData: GenerateOptimizedQueriesOutput | null;
  isLoading: boolean;
  className?: string;
}

export function GeneratedQueriesDisplay({ queriesData, isLoading, className }: GeneratedQueriesDisplayProps) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleCopy = (query: string, id: string) => {
    navigator.clipboard.writeText(query).then(() => {
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      toast({ title: "Copied!", description: "Query copied to clipboard." });
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
      toast({ title: "Error", description: "Failed to copy query.", variant: "destructive" });
    });
  };

  const handleCopyAll = (queries: string[], platform: string) => {
    const allQueriesText = queries.join("\n");
    navigator.clipboard.writeText(allQueriesText).then(() => {
      toast({ title: "All Copied!", description: `All ${platform} queries copied to clipboard.` });
    }).catch(err => {
      console.error("Failed to copy all:", err);
      toast({ title: "Error", description: `Failed to copy all ${platform} queries.`, variant: "destructive" });
    });
  };
  
  const handleExport = (queries: string[], platform: string, format: 'txt' | 'csv') => {
    let content = '';
    let MimeType = '';
    let fileExtension = '';

    if (format === 'txt') {
        content = queries.join('\n');
        MimeType = 'text/plain';
        fileExtension = 'txt';
    } else if (format === 'csv') {
        // Simple CSV: one column "query"
        content = 'query\n' + queries.map(q => `"${q.replace(/"/g, '""')}"`).join('\n');
        MimeType = 'text/csv';
        fileExtension = 'csv';
    }

    const blob = new Blob([content], { type: MimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `seeker_lens_${platform.toLowerCase()}_queries.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({ title: "Exported!", description: `${platform} queries exported as ${fileExtension.toUpperCase()}.` });
  };


  const renderQueryList = (queries: string[] | undefined, platform: string) => {
    if (!queries || queries.length === 0) {
      return <p className="text-sm text-muted-foreground p-4">No {platform} queries generated.</p>;
    }
    return (
      <div className="space-y-3">
        <div className="flex space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => handleCopyAll(queries, platform)}>
              <Copy className="mr-2 h-4 w-4" /> Copy All {platform}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport(queries, platform, 'txt')}>
              <Download className="mr-2 h-4 w-4" /> Export as TXT
            </Button>
             <Button variant="outline" size="sm" onClick={() => handleExport(queries, platform, 'csv')}>
              <Download className="mr-2 h-4 w-4" /> Export as CSV
            </Button>
        </div>
        <ul className="space-y-2">
          {queries.map((query, index) => {
            const queryId = `${platform}-${index}`;
            return (
              <li key={queryId} className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/50 rounded-md group shadow-sm">
                <pre className="font-mono text-sm overflow-x-auto mr-2 flex-grow scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
                  <code>{query}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(query, queryId)}
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                  aria-label={`Copy ${platform} query`}
                >
                  {copiedStates[queryId] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <Card className={`shadow-lg h-full flex flex-col ${className}`}>
        <CardHeader>
          <CardTitle>Generated Queries</CardTitle>
          <CardDescription>Optimized search queries for different platforms.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <Loader size={10} />
        </CardContent>
      </Card>
    );
  }

  if (!queriesData || (!queriesData.googleQueries?.length && !queriesData.yandexQueries?.length)) {
     return (
      <Card className={`shadow-lg h-full flex flex-col ${className}`}>
        <CardHeader>
          <CardTitle>Generated Queries</CardTitle>
          <CardDescription>Optimized search queries for different platforms.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">No queries generated yet. Use the input form to start.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>Generated Queries</CardTitle>
        <CardDescription>Optimized search queries for different platforms. Click to copy.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Tabs defaultValue="google" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="yandex">Yandex</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-grow mt-2"> {/* Make ScrollArea take remaining space */}
            <TabsContent value="google" className="p-1">
              {renderQueryList(queriesData?.googleQueries, "Google")}
            </TabsContent>
            <TabsContent value="yandex" className="p-1">
              {renderQueryList(queriesData?.yandexQueries, "Yandex")}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
