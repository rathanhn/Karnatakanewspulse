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
import { karnatakaDistricts, newsCategories, NewsArticle as NewsArticleType, Category, fetchUserSubmittedNews } from '@/lib/data';
import { fetchNewsFromAPI } from '@/services/news';
import { refineSearchSuggestions } from '@/ai/flows/refine-search-suggestions';
import { NewsCard } from '@/components/news/news-card';
import { NewsSkeleton } from '@/components/news/news-skeleton';
import { AiSummary } from '@/components/ai-summary';
import { Search, MapPin, LayoutGrid, AlertCircle, Home, Users } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { useIsMobile } from '@/hooks/use-mobile';


function NewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  // State for UI controls
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'Karnataka');
  const [selectedCategory, setSelectedCategory] = useState<Category>((searchParams.get('category') as Category) || 'Trending');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  // State for data and loading
  const [allNews, setAllNews] = useState<NewsArticleType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticleType[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for AI summary
  const [aiSummary, setAiSummary] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);

  // Fetch initial data based on URL params or defaults
  useEffect(() => {
    const initialDistrict = searchParams.get('district') || 'Karnataka';
    const initialCategory = (searchParams.get('category') as Category) || 'Trending';
    const initialSearchTerm = searchParams.get('q') || '';

    setSelectedDistrict(initialDistrict);
    setSelectedCategory(initialCategory);
    setSearchTerm(initialSearchTerm);

    const executeFetch = async () => {
        setIsLoading(true);
        setError(null);
        setAllNews([]);
        setFilteredNews([]);
        try {
            // Fetch API news and user-submitted news in parallel
            const [apiNews, userNews] = await Promise.all([
                fetchNewsFromAPI({ district: initialDistrict, category: initialCategory }),
                fetchUserSubmittedNews({ district: initialDistrict })
            ]);

            const combinedNews = [...userNews, ...apiNews].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            // Remove duplicates by URL or headline+source
            const uniqueNews = Array.from(new Map(combinedNews.map(item => [`${item.url || (item.headline+item.source)}`, item])).values());

            setAllNews(uniqueNews);

            if (initialSearchTerm) {
                // If there's an initial search term, filter the results immediately
                const lowerCaseSearchTerm = initialSearchTerm.toLowerCase();
                const results = uniqueNews.filter(
                    (article) =>
                        article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
                        (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
                );
                setFilteredNews(results);
            } else {
                // Otherwise, show all fetched news
                setFilteredNews(uniqueNews);
            }
        } catch (err: any) {
            setError('Failed to fetch news. Please check your connection or API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    executeFetch();
  }, [searchParams]);

  // Client-side filtering logic
  const handleSearch = useCallback((currentSearchTerm: string) => {
    const lowerCaseSearchTerm = currentSearchTerm.toLowerCase();
    if (currentSearchTerm.trim() === '') {
        setFilteredNews(allNews); // Reset to all news if search is cleared
    } else {
        const results = allNews.filter(
            (article) =>
                article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
                (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
        );
        setFilteredNews(results);
    }
  }, [allNews]);

  // Handle form submission and AI summary generation
  const handleSearchSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSearch(searchTerm); // Perform client-side filtering

      const currentResults = allNews.filter(
        (article) =>
          article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      if (searchTerm.trim() && currentResults.length > 0) {
        setIsAiSummaryLoading(true);
        try {
          const searchResultsText = currentResults.map(n => n.headline).join('\n');
          const aiResponse = await refineSearchSuggestions({
            initialQuery: searchTerm,
            searchResults: searchResultsText,
          });
          setAiSummary(aiResponse.summary);
          setAiSuggestions(aiResponse.suggestions);
        } catch (err) {
          setAiSummary('Could not generate summary.');
          setAiSuggestions([]);
        } finally {
          setIsAiSummaryLoading(false);
        }
      } else {
        setAiSummary('');
        setAiSuggestions([]);
      }
  }, [searchTerm, allNews, handleSearch]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  const { userNews, apiNews } = useMemo(() => {
    const userNews = filteredNews.filter(a => a.source === 'User Submitted');
    const apiNews = filteredNews.filter(a => a.source !== 'User Submitted');
    return { userNews, apiNews };
  }, [filteredNews]);

  const NewsContainer = ({ children }: { children: React.ReactNode }) => {
    if (isMobile) {
      return (
        <div className="h-screen-minus-header snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
            {children}
        </div>
      )
    }
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
             <div className="flex items-center gap-2">
                <Link href="/home" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                    <KarnatakaMapIcon className="w-10 h-10"/>
                    <h1 className='hidden sm:block'>Karnataka News Pulse</h1>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-4 w-full max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search within results..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              <Select value={selectedDistrict} onValueChange={val => {setSelectedDistrict(val); router.push(`/news?district=${val}&category=${selectedCategory}`)}}>
                <SelectTrigger className="w-[280px]">
                  <MapPin className="w-5 h-5 mr-2" />
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Karnataka">All Karnataka</SelectItem>
                  {karnatakaDistricts.filter(d=> d !== 'Karnataka').map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select value={selectedCategory} onValueChange={(value) => {setSelectedCategory(value as Category); router.push(`/news?district=${selectedDistrict}&category=${value}`)}}>
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
             <Button asChild variant="ghost">
              <Link href="/home">Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="md:container md:mx-auto md:p-4 md:pt-8">
        <div className="px-4 pt-4 md:px-0 md:pt-0">
          <AiSummary 
            summary={aiSummary} 
            suggestions={aiSuggestions} 
            onSuggestionClick={handleSuggestionClick}
            isLoading={isAiSummaryLoading}
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 md:p-0">
            {[...Array(12)].map((_, i) => <NewsSkeleton key={i} />)}
          </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
                <p className="text-muted-foreground max-w-md">{error}</p>
                <Button onClick={() => router.refresh()} className="mt-6">Try Again</Button>
            </div>
        ) : (
            <>
              {filteredNews.length === 0 && (
                     <div className="text-center py-20">
                        <h2 className="text-2xl font-bold">No news articles found</h2>
                        <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
                    </div>
              )}
                
              {userNews.length > 0 && (
                  <section className="mb-12">
                      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 px-4 md:px-0"><Users /> Community News</h2>
                      <NewsContainer>
                          {userNews.map((article, index) => (
                              <NewsCard key={article.id} article={article} priority={index < 4} />
                          ))}
                      </NewsContainer>
                  </section>
              )}

              {apiNews.length > 0 && (
                <section>
                    {userNews.length > 0 && <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 px-4 md:px-0">Latest Headlines</h2>}
                    <NewsContainer>
                        {apiNews.map((article, index) => (
                          <NewsCard key={article.id} article={article} priority={index < 4 && userNews.length === 0} />
                        ))}
                    </NewsContainer>
                </section>
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
    );
}