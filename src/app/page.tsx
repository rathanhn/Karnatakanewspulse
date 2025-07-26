
'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { karnatakaDistricts, mockNewsData, NewsArticle, Source } from '@/lib/data';
import { refineSearchSuggestions, RefineSearchSuggestionsOutput } from '@/ai/flows/refine-search-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { DailyHuntIcon, FacebookIcon, GoogleIcon, NewsIcon, XIcon, YouTubeIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Clock, Search, Eye, LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AiSummary } from '@/components/ai-summary';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const sourceIcons: Record<Source, React.ReactNode> = {
  DailyHunt: <DailyHuntIcon className="w-5 h-5" />,
  Facebook: <FacebookIcon className="w-5 h-5" />,
  X: <XIcon className="w-5 h-5" />,
  YouTube: <YouTubeIcon className="w-5 h-5" />,
  Google: <GoogleIcon className="w-5 h-5" />,
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(karnatakaDistricts[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResult, setAiResult] = useState<RefineSearchSuggestionsOutput | null>(null);
  const [isAiLoading, startAiTransition] = useTransition();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredNews = useMemo(() => {
    return mockNewsData
      .filter((article) => article.district === selectedDistrict)
      .filter((article) =>
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [selectedDistrict, searchTerm]);

  
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
  
  const handleReadMoreClick = (article: NewsArticle) => {
    setSelectedArticle(article);
  }

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
                    ಕರ್ನಾಟಕ ನ್ಯೂಸ್ ಪಲ್ಸ್
                </h1>
            </div>
          <p className="text-muted-foreground font-headline text-lg">ನಿಮ್ಮ ನೈಜ-ಸಮಯದ ಜಿಲ್ಲಾವಾರು ಸುದ್ದಿ ಕೇಂದ್ರ</p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-80">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="font-headline">ಫಿಲ್ಟರ್ ಮತ್ತು ಹುಡುಕಾಟ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="district-select" className="block text-sm font-medium mb-2">ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ</label>
                  <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                    <SelectTrigger id="district-select" className="w-full">
                      <SelectValue placeholder="ಒಂದು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" />
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
                    placeholder="ಸುದ್ದಿ ಹುಡುಕಿ..."
                    className="pr-10"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchTerm}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
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
                    <div className="relative aspect-video w-full bg-muted">
                      {article.source === 'YouTube' ? (
                        <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          <iframe
                              src={article.embedUrl}
                              title={article.headline}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full pointer-events-none"
                          ></iframe>
                        </Link>
                      ) : (
                        article.imageUrls && article.imageUrls.length > 0 && (
                           <Carousel className="w-full h-full">
                            <CarouselContent>
                              {article.imageUrls.map((url, index) => (
                                <CarouselItem key={index}>
                                  <div className="relative w-full h-full aspect-video">
                                    <Image src={url} alt={`${article.headline} image ${index + 1}`} fill={true} className="object-cover" data-ai-hint="ಸುದ್ದಿ ಮಾಧ್ಯಮ"/>
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
                        )
                      )}
                    </div>
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
                       <div className="flex items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-auto text-xs" onClick={() => handleReadMoreClick(article)}>
                                    <Eye className="w-4 h-4 mr-1"/>
                                    ಮತ್ತಷ್ಟು ಓದಿ
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                        <Button variant="ghost" size="sm" asChild  className="p-0 h-auto text-xs">
                          <Link href={article.url} target="_blank" rel="noopener noreferrer">
                              <LinkIcon className="w-4 h-4 mr-1"/>
                              ಮೂಲ ನೋಡಿ
                          </Link>
                        </Button>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3"/>
                            <span>{formatDistanceToNow(article.timestamp, { addSuffix: true })}</span>
                        </div>
                       </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-2 xl:grid-cols-3 text-center py-16">
                  <p className="text-muted-foreground text-lg">ಯಾವುದೇ ಸುದ್ದಿ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಹೊಂದಿಸಲು ಪ್ರಯತ್ನಿಸಿ.</p>
                </div>
              )}
            </div>
          </main>
        </div>
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
                            <span>{formatDistanceToNow(selectedArticle.timestamp, { addSuffix: true })}</span>
                         </div>
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
