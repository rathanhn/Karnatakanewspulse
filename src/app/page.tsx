
'use client';

import React, { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { karnatakaDistricts, NewsArticle, Source, newsCategories, Category } from '@/lib/data';
import { refineSearchSuggestions, RefineSearchSuggestionsOutput } from '@/ai/flows/refine-search-suggestions';
import { generateNews, GeneratedNewsArticle } from '@/ai/flows/generate-news';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DailyHuntIcon, FacebookIcon, KarnatakaMapIcon, XIcon, YouTubeIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Clock, Search, Eye, LinkIcon, RefreshCw, Newspaper, Menu, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { AiSummary } from '@/components/ai-summary';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';


const sourceIcons: Record<Source, React.ReactNode> = {
  DailyHunt: <DailyHuntIcon className="w-5 h-5" />,
  Facebook: <FacebookIcon className="w-5 h-5" />,
  X: <XIcon className="w-5 h-5" />,
  YouTube: <YouTubeIcon className="w-5 h-5" />,
};

const NewsCardSkeleton = () => (
    <Card className="flex flex-col overflow-hidden shadow-lg bg-card">
        <Skeleton className="relative aspect-video w-full bg-muted" />
        <CardContent className="p-4 flex-grow">
            <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
            </div>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
        <CardFooter className="p-4 bg-secondary/50">
            <div className="flex justify-between items-center w-full">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
            </div>
        </CardFooter>
    </Card>
);

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResult, setAiResult] = useState<RefineSearchSuggestionsOutput | null>(null);
  const [isAiLoading, startAiTransition] = useTransition();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(newsCategories[0]);
  
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isNewsLoading, startNewsTransition] = useTransition();

  const { toast } = useToast();

  const fetchNews = useCallback((district: string, category: Category) => {
    startNewsTransition(async () => {
        try {
            const result = await generateNews({ district, category });
            const articles: NewsArticle[] = result.articles.map((article, index) => ({
                id: `${district}-${category}-${index}-${Date.now()}`,
                district,
                category,
                timestamp: new Date(),
                imageUrls: ['https://placehold.co/600x400.png'], // Always use placeholder for all sources
                ...article,
            }));
            setNews(articles);
        } catch (error) {
            console.error("Failed to generate news:", error);
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Failed to generate real-time news articles.",
            });
            setNews([]); // Clear news on error
        }
    });
  }, [toast]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && selectedDistrict) {
      fetchNews(selectedDistrict, selectedCategory);
    }
  }, [selectedDistrict, selectedCategory, fetchNews, isMounted]);

  const filteredNews = useMemo(() => {
    if (isNewsLoading) return [];
    return news
      .filter((article) =>
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [news, searchTerm, isNewsLoading]);

  
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
                description: "Failed to get AI-powered suggestions.",
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
  
  const handleReadMoreClick = (article: NewsArticle) => {
    setSelectedArticle(article);
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    if (selectedDistrict) {
        fetchNews(selectedDistrict, category);
    }
  }

  const resetDistrict = () => {
    setSelectedDistrict(null);
    setNews([]);
    setSearchTerm('');
    setAiResult(null);
  }

  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="bg-background min-h-screen font-body text-foreground">
      <header className="py-6 border-b border-border/50">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <KarnatakaMapIcon className="w-10 h-10 waving-flag" />
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
                        Karnataka News Pulse
                    </h1>
                </div>
              <p className="text-muted-foreground font-headline text-lg text-center md:text-left">Your real-time district-wise news hub</p>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Categories</DropdownMenuLabel>
                    {newsCategories.map((category) => (
                      <DropdownMenuItem key={category} onSelect={() => handleCategoryChange(category)}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        {!selectedDistrict ? (
            <div className="flex flex-col items-center justify-center pt-16">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center font-headline text-2xl">Select a District</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Select onValueChange={handleDistrictChange}>
                            <SelectTrigger id="district-select" className="w-full text-lg h-12">
                                <SelectValue placeholder="Choose your district to see news" />
                            </SelectTrigger>
                            <SelectContent>
                                {karnatakaDistricts.map((district) => (
                                <SelectItem key={district} value={district}>
                                    {district}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>
        ) : (
          <main>
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <Button variant="outline" onClick={resetDistrict}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change District
                </Button>
                <div className="relative w-full md:max-w-sm">
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
                <Button onClick={() => fetchNews(selectedDistrict, selectedCategory)} disabled={isNewsLoading} className="w-full md:w-auto">
                    <RefreshCw className={`w-4 h-4 mr-2 ${isNewsLoading ? 'animate-spin' : ''}`} />
                    {isNewsLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

             <AiSummary
              isLoading={isAiLoading}
              summary={aiResult?.summary ?? ''}
              suggestions={aiResult?.suggestions ?? []}
              onSuggestionClick={handleSuggestionClick}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isNewsLoading ? (
                 <>
                    <NewsCardSkeleton />
                    <NewsCardSkeleton />
                    <NewsCardSkeleton />
                    <NewsCardSkeleton />
                    <NewsCardSkeleton />
                    <NewsCardSkeleton />
                 </>
              ) : filteredNews.length > 0 ? (
                filteredNews.map((article) => (
                  <Card key={article.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                    <div className="relative aspect-video w-full bg-muted">
                      {article.imageUrls && article.imageUrls.length > 0 && (
                         <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                           <Carousel className="w-full h-full">
                            <CarouselContent>
                              {article.imageUrls.map((url, index) => (
                                <CarouselItem key={index}>
                                  <div className="relative w-full h-full aspect-video">
                                    <Image src={url} alt={`${article.headline} image ${index + 1}`} fill={true} className="object-cover" data-ai-hint={article['data-ai-hint']}/>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            {article.imageUrls.length > 1 && (
                              <>
                                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                              </>
                            )}
                          </Carousel>
                         </Link>
                      )}
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="secondary" >{article.district}</Badge>
                        <Badge variant="outline" className="border-primary/50 text-primary">{article.category}</Badge>
                      </div>
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
                       <div className="flex items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-auto text-xs" onClick={() => handleReadMoreClick(article)}>
                                    <Eye className="w-4 h-4 mr-1"/>
                                    Read More
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                        <Button variant="ghost" size="sm" asChild  className="p-0 h-auto text-xs">
                          <Link href={article.url} target="_blank" rel="noopener noreferrer">
                              <LinkIcon className="w-4 h-4 mr-1"/>
                              View Source
                          </Link>
                        </Button>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3"/>
                            <span>{format(article.timestamp, 'dd MMM, hh:mm a')}</span>
                        </div>
                       </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-2 xl:col-span-3 text-center py-16 flex flex-col items-center gap-4">
                  <Newspaper className="w-16 h-16 text-muted-foreground/50"/>
                  <p className="text-muted-foreground text-lg">No news articles found.</p>
                  <p className="text-muted-foreground text-sm">Try selecting a different category or refreshing the news.</p>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
       {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={(isOpen) => !isOpen && setSelectedArticle(null)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{selectedArticle.headline}</DialogTitle>
                     <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                         <div className="flex items-center gap-2">
                            {sourceIcons[selectedArticle.source]}
                            <span>{selectedArticle.source}</span>
                         </div>
                         <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3"/>
                            <span>{format(selectedArticle.timestamp, 'dd MMM, hh:mm a')}</span>
                         </div>
                         <Badge variant="outline" className="border-primary/50 text-primary">{selectedArticle.category}</Badge>
                      </div>
                </DialogHeader>
                <div className="py-4 text-sm text-foreground max-h-[60vh] overflow-y-auto">
                    <p>{selectedArticle.content}</p>
                </div>
                <DialogClose />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    