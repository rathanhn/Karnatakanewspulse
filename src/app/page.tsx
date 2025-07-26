
'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import Image from 'next/image';
import { karnatakaDistricts, mockNewsData, NewsArticle, Source } from '@/lib/data';
import { refineSearchSuggestions, RefineSearchSuggestionsOutput } from '@/ai/flows/refine-search-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DailyHuntIcon, FacebookIcon, GoogleIcon, NewsIcon, XIcon, YouTubeIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Clock, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AiSummary } from '@/components/ai-summary';
import { useToast } from '@/hooks/use-toast';

const sourceIcons: Record<Source, React.ReactNode> = {
  DailyHunt: <DailyHuntIcon className="w-5 h-5" />,
  Facebook: <FacebookIcon className="w-5 h-5" />,
  X: <XIcon className="w-5 h-5" />,
  YouTube: <YouTubeIcon className="w-5 h-5" />,
  Google: <GoogleIcon className="w-5 h-5" />,
};

const sources: Source[] = ['DailyHunt', 'Facebook', 'X', 'YouTube', 'Google'];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(karnatakaDistricts[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Source[]>([]);
  const [aiResult, setAiResult] = useState<RefineSearchSuggestionsOutput | null>(null);
  const [isAiLoading, startAiTransition] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredNews = useMemo(() => {
    return mockNewsData
      .filter((article) => article.district === selectedDistrict)
      .filter((article) => activeFilters.length === 0 || activeFilters.includes(article.source))
      .filter((article) =>
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [selectedDistrict, activeFilters, searchTerm]);

  const handleFilterToggle = (source: Source) => {
    setActiveFilters((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
        setSearchTerm("");
        setAiResult(null);
        return;
    }

    setSearchTerm(query);
    setAiResult(null);

    const searchResultsText = filteredNews
        .filter(article => article.headline.toLowerCase().includes(query.toLowerCase()) || article.content.toLowerCase().includes(query.toLowerCase()))
        .map(a => `${a.headline}: ${a.content}`).join('\n\n');

    if (searchResultsText.length < 50) { // Not enough content to summarize
        return;
    }

    startAiTransition(async () => {
        try {
            const result = await refineSearchSuggestions({
                initialQuery: query,
                searchResults: searchResultsText.substring(0, 10000) // Limit context size
            });
            setAiResult(result);
        } catch (error) {
            console.error("AI refinement failed:", error);
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Could not get AI-powered suggestions.",
            });
        }
    });
  }

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSearchTerm('');
    setAiResult(null);
  }

  const handleSuggestionClick = (suggestion: string) => {
    document.getElementById('search-input')?.focus();
    handleSearch(suggestion);
  };

  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="bg-background min-h-screen font-body text-foreground">
      <header className="py-6 border-b border-border/50">
        <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
                <NewsIcon className="w-10 h-10 text-primary" />
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
                    Karnataka News Pulse
                </h1>
            </div>
          <p className="text-muted-foreground font-headline text-lg">Your real-time district-wise news hub</p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 space-y-8 sticky top-8 self-start">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Filter & Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="district-select" className="block text-sm font-medium mb-2">Select District</label>
                  <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                    <SelectTrigger id="district-select" className="w-full">
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                      {karnatakaDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Search news..."
                    className="pr-10"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchTerm}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Filter by Source</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {sources.map((source) => (
                  <Button
                    key={source}
                    variant={activeFilters.includes(source) ? "default" : "secondary"}
                    onClick={() => handleFilterToggle(source)}
                    className="flex items-center gap-2"
                  >
                    {sourceIcons[source]}
                    {source}
                  </Button>
                ))}
              </CardContent>
            </Card>

          </aside>

          <main className="lg:col-span-3">
             <AiSummary
              isLoading={isAiLoading}
              summary={aiResult?.summary ?? ''}
              suggestions={aiResult?.suggestions ?? []}
              onSuggestionClick={handleSuggestionClick}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredNews.length > 0 ? (
                filteredNews.map((article) => (
                  <Card key={article.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                    <CardHeader className="p-0">
                      <div className="relative aspect-video w-full">
                        {article.source === 'YouTube' ? (
                            <iframe
                                src={article.url}
                                title={article.headline}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                           <Image src={article.imageUrl} alt={article.headline} layout="fill" objectFit="cover" data-ai-hint="news media"/>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <Badge variant="secondary" className="mb-2">{article.district}</Badge>
                      <h3 className="text-lg font-bold font-headline leading-tight mb-2 text-card-foreground">
                        {article.headline}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                    </CardContent>
                    <CardFooter className="p-4 bg-secondary/50 flex justify-between items-center text-xs text-muted-foreground">
                       <div className="flex items-center gap-2">
                          {sourceIcons[article.source]}
                          <span>{article.source}</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3"/>
                          <span>{formatDistanceToNow(article.timestamp, { addSuffix: true })}</span>
                       </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-2 xl:col-span-3 text-center py-16">
                  <p className="text-muted-foreground text-lg">No news articles found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
