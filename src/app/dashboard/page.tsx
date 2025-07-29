// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { NewsCard } from '@/components/news/news-card';
import { NewsSkeleton } from '@/components/news/news-skeleton';
import { fetchNewsFromAPI } from '@/services/news';
import { NewsArticle, karnatakaDistricts, Category } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Search, MapPin, TrendingUp, Star } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';

export default function Dashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [recommendedNews, setRecommendedNews] = useState<NewsArticle[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('Karnataka');

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      try {
        const [trending, recommended] = await Promise.all([
          fetchNewsFromAPI({ district: 'Karnataka', category: 'Trending' }),
          fetchNewsFromAPI({ district: 'Bengaluru Urban', category: 'General' }), // Placeholder for recommendation
        ]);
        setTrendingNews(trending.slice(0, 4));
        setRecommendedNews(recommended.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch news:", error);
        toast({
          title: 'Error',
          description: 'Could not fetch news articles.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    getNews();
  }, [toast]);
  
  const handleLogout = async () => {
    await toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const searchTerm = formData.get('search') as string;
      const district = selectedDistrict;
      router.push(`/news?q=${searchTerm}&district=${district}`);
  }

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
           <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
            <KarnatakaMapIcon className="w-10 h-10" />
            <h1>Karnataka News Pulse</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/news">News Feed</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/news')}>
                  View News Feed
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-3xl font-bold mb-4">Find Your News</h2>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="search"
                  type="search"
                  placeholder="Search for news, topics, or places..."
                  className="pl-10 w-full h-12 text-base"
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-full md:w-[280px] h-12 text-base">
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
                 <Button type="submit" size="lg" className="h-12">Search</Button>
              </div>
            </form>
        </div>

        {/* Recommended News */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Star/> News For You</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? [...Array(4)].map((_, i) => <NewsSkeleton key={i} />)
                : recommendedNews.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
            </div>
        </section>

        {/* Trending News */}
        <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><TrendingUp/> Trending in Karnataka</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? [...Array(4)].map((_, i) => <NewsSkeleton key={i} />)
                : trendingNews.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
            </div>
        </section>
      </main>
    </div>
  );
}
