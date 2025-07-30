// src/app/home/page.tsx
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { NewsCard } from '@/components/news/news-card';
import { NewsSkeleton } from '@/components/news/news-skeleton';
import { fetchNewsFromAPI } from '@/services/news';
import { NewsArticle, karnatakaDistricts, Category, UserProfile, getUserProfile } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User, Search, MapPin, TrendingUp, Star, ChevronsUpDown, Check, PlusCircle, Newspaper, Settings } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function HomePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendedNews, setRecommendedNews] = useState<NewsArticle[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('Karnataka');
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user profile
        try {
            const profile = await getUserProfile(currentUser.uid);
            setUserProfile(profile);
            setSelectedDistrict(profile?.preferredDistrict || 'Karnataka');
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      try {
        const [trending, recommended] = await Promise.all([
          fetchNewsFromAPI({ district: 'Karnataka', category: 'Trending' }),
          fetchNewsFromAPI({ district: userProfile?.preferredDistrict || 'Bengaluru Urban', category: userProfile?.preferredCategory || 'General' }),
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
    if(user) {
        getNews();
    }
  }, [toast, user, userProfile]);
  
  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({
          title: 'Logged out',
          description: 'You have been successfully logged out.',
        });
        router.push('/login');
    } catch(error) {
         toast({
          title: 'Logout Error',
          description: 'Could not log you out. Please try again.',
          variant: 'destructive'
        });
    }
  };
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const searchTerm = formData.get('search') as string;
      const district = selectedDistrict;
      router.push(`/news?q=${searchTerm}&district=${district}`);
  }
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
           <Link href="/home" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
            <KarnatakaMapIcon className="w-10 h-10" />
            <h1>Karnataka News Pulse</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/news/create"><PlusCircle /> Create Post</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/news">News Feed</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.displayName || 'User'} />
                        <AvatarFallback>{getInitials(userProfile?.displayName)}</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <p className="font-semibold">{userProfile?.displayName || 'Welcome'}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/home/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push('/home/my-posts')}>
                  <Newspaper className="mr-2 h-4 w-4" />
                  <span>My Posts</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => router.push('/news/create')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create Post</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
                 <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full md:w-[280px] h-12 text-base justify-between"
                      >
                         <MapPin className="w-5 h-5 mr-2 shrink-0" />
                        <span className="truncate">
                        {selectedDistrict
                          ? karnatakaDistricts.find((district) => district === selectedDistrict) || 'All Karnataka'
                          : "Select District"}
                          </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <Command>
                        <CommandInput placeholder="Search district..." />
                        <CommandEmpty>No district found.</CommandEmpty>
                        <CommandGroup>
                           <CommandItem
                                key="Karnataka"
                                value="Karnataka"
                                onSelect={(currentValue) => {
                                  setSelectedDistrict(currentValue === "Karnataka" ? "Karnataka" : currentValue)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDistrict === "Karnataka" ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                All Karnataka
                              </CommandItem>
                          {karnatakaDistricts.filter(d => d !== 'Karnataka').map((district) => (
                            <CommandItem
                              key={district}
                              value={district}
                              onSelect={(currentValue) => {
                                setSelectedDistrict(currentValue === selectedDistrict ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedDistrict === district ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {district}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                 <Button type="submit" size="lg" className="h-12">Search</Button>
              </div>
            </form>
        </div>

        {/* Recommended News */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Star/> News For You in {userProfile?.preferredDistrict || 'Bengaluru Urban'}</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? [...Array(4)].map((_, i) => <NewsSkeleton key={i} />)
                : recommendedNews.map((article, index) => (
                    <NewsCard key={article.id} article={article} priority={index < 2} />
                  ))}
            </div>
        </section>

        {/* Trending News */}
        <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><TrendingUp/> Trending in Karnataka</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? [...Array(4)].map((_, i) => <NewsSkeleton key={i} />)
                : trendingNews.map((article, index) => (
                    <NewsCard key={article.id} article={article} priority={index < 2} />
                  ))}
            </div>
        </section>
      </main>
    </div>
  );
}
