// src/app/news/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { fetchNewsFromAPI, fetchUserSubmittedNews } from '@/services/news';
import { refineSearchSuggestions } from '@/ai/flows/refine-search-suggestions';
import { NewsCard } from '@/components/news/news-card';
import { NewsSkeleton } from '@/components/news/news-skeleton';
import { AiSummary } from '@/components/ai-summary';
import { Search, MapPin, LayoutGrid, AlertCircle, Home, Users } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';


function NewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'Karnataka');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Trending');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  const [apiNews, setApiNews] = useState<NewsArticleType[]>([]);
  const [userNews, setUserNews] = useState<NewsArticleType[]>([]);
  const [filteredApiNews, setFilteredApiNews] = useState<NewsArticleType[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aiSummary, setAiSummary] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);

  const fetchNews = useCallback(async (district: string, category: Category) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch both user news and API news in parallel
      const [userResult, apiResult] = await Promise.all([
        fetchUserSubmittedNews({ district }),
        fetchNewsFromAPI({ district, category })
      ]);
      
      setUserNews(userResult);
      setApiNews(apiResult);
      setFilteredApiNews(apiResult); // Initially show all fetched API news
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please check your connection or API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(selectedDistrict, selectedCategory);
  }, [selectedDistrict, selectedCategory, fetchNews]);

  const handleSearch = useCallback(async (currentSearchTerm: string) => {
    const lowerCaseSearchTerm = currentSearchTerm.toLowerCase();
    
    // Filter based on the original full list of API news
    const results = apiNews.filter(
      (article) =>
        article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
        (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredApiNews(results);

    // Also filter user news
    const userResults = userNews.filter(
        (article) =>
            article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
            (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setUserNews(userResults);


    if (currentSearchTerm.trim() && (results.length > 0 || userResults.length > 0)) {
      setIsAiSummaryLoading(true);
      try {
        const searchResultsText = [...userResults, ...results].map(n => n.headline).join('\n');
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
       // Reset user news to full list on empty search
      fetchUserSubmittedNews({district: selectedDistrict}).then(setUserNews);
    }
  }, [apiNews, userNews, selectedDistrict]);
  
  useEffect(() => {
    // Initial search if q param exists
    if(searchTerm) {
        handleSearch(searchTerm);
    } else {
        // If search is cleared, ensure API news is reset
        setFilteredApiNews(apiNews);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, apiNews]); // Rerun search when apiNews is loaded or searchTerm changes

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSearch(searchTerm);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
             <div className="flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                    <KarnatakaMapIcon className="w-10 h-10"/>
                    <h1 className='hidden sm:block'>Karnataka News Pulse</h1>
                </Link>
            </div>
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-4 w-full max-w-2xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for news..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
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
            </form>
             <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
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
            {[...Array(12)].map((_, i) => <NewsSkeleton key={i} />)}
          </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
                <p className="text-muted-foreground max-w-md">{error}</p>
                <Button onClick={() => fetchNews(selectedDistrict, selectedCategory)} className="mt-6">Try Again</Button>
            </div>
        ) : (
            <>
                {userNews.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Users /> Community News</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {userNews.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}

                {filteredApiNews.length === 0 ? (
                    userNews.length === 0 && (
                         <div className="text-center py-20">
                            <h2 className="text-2xl font-bold">No news articles found</h2>
                            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                        </div>
                    )
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredApiNews.map((article) => (
                        <NewsCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
           </>
        )}
      </main>
    </div>
  );
}


export default function NewsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewsContent />
        </Suspense>
    )
}
