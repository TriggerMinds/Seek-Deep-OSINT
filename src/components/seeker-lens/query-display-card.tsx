
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";
import { useState } from "react"; // Removed useEffect as it's not used
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Added cn import

interface QueryDisplayCardProps {
  title: string;
  description?: string;
  queries: string[];
  isLoading?: boolean;
  className?: string;
}

export function QueryDisplayCard({ title, description, queries, isLoading, className }: QueryDisplayCardProps) {
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (query: string) => {
    navigator.clipboard.writeText(query).then(() => {
      setCopiedQuery(query);
      toast({ title: "Copied!", description: "Query copied to clipboard." });
      setTimeout(() => setCopiedQuery(null), 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
      toast({ title: "Error", description: "Failed to copy query.", variant: "destructive" });
    });
  };

  if (isLoading) {
    return (
      <Card className={cn("shadow-lg", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2 pt-4"> {/* Added pt-4 to align with non-loading state */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!queries || queries.length === 0) {
     return (
      <Card className={cn("shadow-lg", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
           {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground pt-4">No queries to display.</p> {/* Added pt-4 */}
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className={cn("shadow-lg", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4"> {/* Adjust height as needed */}
          <ul className="space-y-2">
            {queries.map((query, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-muted/50 dark:bg-muted/60 rounded-md group shadow-sm">
                <pre className="font-mono text-sm overflow-x-auto mr-2 flex-grow scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
                  <code>{query}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(query)}
                  className="opacity-60 group-hover:opacity-100 transition-opacity"
                  aria-label="Copy query"
                >
                  {copiedQuery === query ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

    