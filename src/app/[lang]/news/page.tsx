
// src/app/news/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo, Suspense, use } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { karnatakaDistricts, newsCategories, NewsArticle as NewsArticleType, Category, fetchUserSubmittedNewsWithAuthors } from '@/lib/data';
import { fetchNewsFromAPI } from '@/services/news';
import { refineSearchSuggestions } from '@/ai/flows/refine-search-suggestions';
import { NewsCard } from '@/components/news/news-card';
import { NewsSkeleton } from '@/components/news/news-skeleton';
import { AiSummary } from '@/components/ai-summary';
import { Search, MapPin, LayoutGrid, AlertCircle, Home, Users, Globe } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { useIsMobile } from '@/hooks/use-mobile';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getDictionary } from '@/lib/i18n';


function NewsContent({ params }: { params: { lang: 'en' | 'kn' } }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { lang } = use(params);
  
  const [user, setUser] = useState<User | null>(null);

  const [dict, setDict] = useState(getDictionary(lang));

  // State for UI controls
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'Karnataka');
  const [selectedCategory, setSelectedCategory] = useState<Category>((searchParams.get('category') as Category) || 'Trending');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  
  // State for data and loading
  const [allNews, setAllNews] = useState<NewsArticleType[]>([]);
  const [userNews, setUserNews] = useState<NewsArticleType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticleType[]>([]);
  const [filteredUserNews, setFilteredUserNews] = useState<NewsArticleType[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for AI summary
  const [aiSummary, setAiSummary] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);

  useEffect(() => {
    setDict(getDictionary(lang));
  }, [lang]);
  
  const handleLanguageChange = (newLang: 'en' | 'kn') => {
    const newPath = `/${newLang}${pathname.replace(/^\/(en|kn)/, '')}`;
    router.push(newPath);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
        setUserNews([]);
        setFilteredUserNews([]);
        try {
            // Fetch API news and all user-submitted news in parallel
            const [apiNews, userSubmittedNews] = await Promise.all([
                fetchNewsFromAPI({ district: initialDistrict, category: initialCategory }),
                fetchUserSubmittedNewsWithAuthors({ district: initialDistrict })
            ]);
            
            const combinedNews = [...apiNews].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            // Remove duplicates by URL or headline+source
            const uniqueNews = Array.from(new Map(combinedNews.map(item => [`${item.url || (item.headline+item.source)}`, item])).values());

            setAllNews(uniqueNews);
            setUserNews(userSubmittedNews);

            if (initialSearchTerm) {
                // If there's an initial search term, filter the results immediately
                const lowerCaseSearchTerm = initialSearchTerm.toLowerCase();
                const apiResults = uniqueNews.filter(
                    (article) =>
                        article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
                        (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
                );
                 const userResults = userSubmittedNews.filter(
                    (article) =>
                        article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
                        (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
                );
                setFilteredNews(apiResults);
                setFilteredUserNews(userResults);
            } else {
                // Otherwise, show all fetched news
                setFilteredNews(uniqueNews);
                setFilteredUserNews(userSubmittedNews);
            }
        } catch (err: any) {
            setError(`Failed to fetch news. Please check your connection or API key and try again. Error: ${err.message}`);
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
        setFilteredNews(allNews); // Reset to all api news if search is cleared
        setFilteredUserNews(userNews); // Reset to all user news if search is cleared
    } else {
        const apiResults = allNews.filter(
            (article) =>
                article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
                (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
        );
         const userResults = userNews.filter(
            (article) =>
                article.headline.toLowerCase().includes(lowerCaseSearchTerm) ||
                (article.content && article.content.toLowerCase().includes(lowerCaseSearchTerm))
        );
        setFilteredNews(apiResults);
        setFilteredUserNews(userResults);
    }
  }, [allNews, userNews]);

  // Handle form submission and AI summary generation
  const handleSearchSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSearch(searchTerm); // Perform client-side filtering

      // Re-filter the original sources to get current results for AI summary
      const currentApiResults = allNews.filter(
            (article) =>
                article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      const currentUserResults = userNews.filter(
            (article) =>
                article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      const currentResults = [...currentApiResults, ...currentUserResults];

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
  }, [searchTerm, allNews, userNews, handleSearch]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };
  
  const sortedUserNews = useMemo(() => {
    return filteredUserNews.sort((a, b) => {
        const aIsMyPost = a.userId === user?.uid;
        const bIsMyPost = b.userId === user?.uid;
        if (aIsMyPost && !bIsMyPost) return -1;
        if (!aIsMyPost && bIsMyPost) return 1;
        return 0;
    });
  }, [filteredUserNews, user?.uid]);


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
                <Link href={`/${lang}/home`} className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                    <KarnatakaMapIcon className="w-10 h-10"/>
                    <h1 className='hidden sm:block'>Karnataka News Pulse</h1>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-4 w-full max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={dict.searchPlaceholder}
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              <Select value={selectedDistrict} onValueChange={val => {setSelectedDistrict(val); router.push(`/${lang}/news?district=${val}&category=${selectedCategory}`)}}>
                <SelectTrigger className="w-[280px]">
                  <MapPin className="w-5 h-5 mr-2" />
                  <SelectValue placeholder={dict.selectDistrict} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Karnataka">{dict.allKarnataka}</SelectItem>
                  {karnatakaDistricts.filter(d=> d !== 'Karnataka').map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select value={selectedCategory} onValueChange={(value) => {setSelectedCategory(value as Category); router.push(`/${lang}/news?district=${selectedDistrict}&category=${value}`)}}>
                <SelectTrigger className="w-[220px]">
                  <LayoutGrid className="w-5 h-5 mr-2" />
                  <SelectValue placeholder={dict.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {newsCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {dict.categories[category as keyof typeof dict.categories] || category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Globe />
                            <span className="sr-only">Change language</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleLanguageChange('kn')}>ಕನ್ನಡ</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button asChild variant="ghost">
                    <Link href={`/${lang}/home`}>{dict.home}</Link>
                </Button>
            </div>
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
                <h2 className="text-2xl font-bold mb-2">{dict.errorOccurred}</h2>
                <p className="text-muted-foreground max-w-md">{error}</p>
                <Button onClick={() => router.refresh()} className="mt-6">{dict.tryAgain}</Button>
            </div>
        ) : (
             <Tabs defaultValue="latest" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto">
                    <TabsTrigger value="latest">{dict.latestHeadlines}</TabsTrigger>
                    <TabsTrigger value="community">{dict.communityNews}</TabsTrigger>
                </TabsList>
                <TabsContent value="latest" className="mt-6">
                    {filteredNews.length > 0 ? (
                         <NewsContainer>
                            {filteredNews.map((article, index) => (
                              <NewsCard key={article.id} article={article} priority={index < 4} lang={lang} />
                            ))}
                        </NewsContainer>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold">{dict.noArticlesFound}</h2>
                            <p className="text-muted-foreground">{dict.adjustFilters}</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="community" className="mt-6">
                    {sortedUserNews.length > 0 ? (
                        <NewsContainer>
                            {sortedUserNews.map((article, index) => (
                                <NewsCard key={article.id} article={article} priority={index < 4} isMyPost={article.userId === user?.uid} lang={lang} />
                            ))}
                        </NewsContainer>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold">{dict.noCommunityArticles}</h2>
                            <p className="text-muted-foreground">{dict.beTheFirstToPost}</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        )}
      </main>
    </div>
  );
}


export default function NewsPage({ params }: { params: { lang: 'en' | 'kn' } }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewsContent params={params} />
        </Suspense>
    );
}
