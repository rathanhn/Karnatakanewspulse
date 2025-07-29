// src/app/news/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { karnatakaDistricts, newsCategories, NewsArticle as NewsArticleType, Category } from '@/lib/data';
import { fetchNewsFromAPI } from '@/services/news';
import { refineSearchSuggestions } from '@/ai/flows/refine-search-suggestions';
import { NewsCard } from '@/components/news/news-card';
import { NewsSkeleton } from '@/components/news/news-skeleton';
import { AiSummary } from '@/components/ai-summary';
import { Search, MapPin, LayoutGrid, AlertCircle, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewsPage() {
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState('Karnataka');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [news, setNews] = useState<NewsArticleType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aiSummary, setAiSummary] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchNewsFromAPI({
        district: selectedDistrict,
        category: selectedCategory,
      });
      setNews(result);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please check your connection or API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDistrict, selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = useCallback(async (currentSearchTerm: string) => {
    if (!currentSearchTerm.trim()) {
      setFilteredNews(news);
      setAiSummary('');
      setAiSuggestions([]);
      return;
    }

    const lowerCaseSearchTerm = currentSearchTerm.toLowerCase();
    const results = news.filter(
      (article) =>
        article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
        (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredNews(results);

    if (results.length > 0) {
      setIsAiSummaryLoading(true);
      try {
        const searchResultsText = results.map(n => n.headline).join('\n');
        const aiResponse = await refineSearchSuggestions({
          initialQuery: currentSearchTerm,
          searchResults: searchResultsText,
        });
        setAiSummary(aiResponse.summary);
        setAiSuggestions(aiResponse.suggestions);
      } catch (err) {
        console.error("AI suggestion error:", err);
        setAiSummary('Could not generate summary.');
        setAiSuggestions([]);
      } finally {
        setIsAiSummaryLoading(false);
      }
    } else {
      setAiSummary('');
      setAiSuggestions([]);
    }
  }, [news]);
  
  useEffect(() => {
    // Debounce search
    const handler = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, handleSearch]);


  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };
  
  const displayNews = useMemo(() => searchTerm.trim() ? filteredNews : news, [searchTerm, filteredNews, news]);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
             <div className="flex items-center gap-2">
                <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                    <Home className="w-8 h-8"/>
                    <h1>Karnataka News Pulse</h1>
                </button>
            </div>
            <div className="hidden md:flex items-center gap-4 w-full max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for news..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-[280px]">
                  <MapPin className="w-5 h-5 mr-2" />
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Karnataka">All Karnataka</SelectItem>
                  {karnatakaDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
                <SelectTrigger className="w-[220px]">
                  <LayoutGrid className="w-5 h-5 mr-2" />
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {newsCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" className="md:hidden">
              <Search className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <AiSummary 
          summary={aiSummary} 
          suggestions={aiSuggestions} 
          onSuggestionClick={handleSuggestionClick}
          isLoading={isAiSummaryLoading}
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <NewsSkeleton key={i} />)}
          </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
                <p className="text-muted-foreground max-w-md">{error}</p>
                <Button onClick={fetchNews} className="mt-6">Try Again</Button>
            </div>
        ) : displayNews.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">No news articles found</h2>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
