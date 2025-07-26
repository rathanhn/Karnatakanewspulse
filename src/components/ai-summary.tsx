"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

type AiSummaryProps = {
  summary: string;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
};

export function AiSummary({ summary, suggestions, onSuggestionClick, isLoading }: AiSummaryProps) {
  const shouldRender = isLoading || (summary && suggestions.length > 0);

  if (!shouldRender) {
    return null;
  }

  return (
    <Card className="mb-8 shadow-lg bg-card border-accent/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-accent">
          <Lightbulb className="w-6 h-6" />
          <span>AI-Powered Search Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        ) : (
          <>
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Summary</h4>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-card-foreground">Refine Your Search</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="default"
                    className="cursor-pointer bg-primary/20 text-primary-foreground border-primary/50 hover:bg-primary/30"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
