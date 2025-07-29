// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/news/news-card';
import { NewsSkeleton } from '@/components/news/news-skeleton';
import { fetchNewsFromAPI, fetchUserSubmittedNews } from '@/services/news';
import { NewsArticle } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Newspaper, Lightbulb, Map, BarChart, Users } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';

const features = [
  {
    icon: <Newspaper className="w-8 h-8 text-primary" />,
    title: 'Real-Time News',
    description: 'Access up-to-the-minute news from across Karnataka, sourced from top platforms.',
  },
  {
    icon: <Map className="w-8 h-8 text-primary" />,
    title: 'District-Wise Filtering',
    description: 'Easily filter news by specific districts to get relevant local updates.',
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: 'AI-Powered Insights',
    description: 'Get AI-generated summaries and suggestions to refine your search and discover trends.',
  },
    {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: 'Insightful Dashboard',
    description: 'Visualize news trends with interactive charts for categories, sources, and districts.',
  },
];

export default function SplashPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [userNews, setUserNews] = useState<NewsArticle[]>([]);
  const [isLatestLoading, setIsLatestLoading] = useState(true);
  const [isUserNewsLoading, setIsUserNewsLoading] = useState(true);


  useEffect(() => {
    const getNews = async () => {
      setIsLatestLoading(true);
      setIsUserNewsLoading(true);
      try {
        const [apiNews, communityNews] = await Promise.all([
             fetchNewsFromAPI({ district: 'Karnataka', category: 'Trending', sources: 'api', limit: 4 }),
             fetchUserSubmittedNews({ district: 'Karnataka', limit: 4})
        ]);
        setLatestNews(apiNews);
        setUserNews(communityNews);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLatestLoading(false);
        setIsUserNewsLoading(false);
      }
    };
    getNews();
  }, []);

  const handleNewsClick = (e: React.MouseEvent<HTMLDivElement>) => {
     // Prevent navigation if a button inside the card was clicked
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    toast({
      title: 'Login Required',
      description: 'Please log in or register to read the full story.',
      variant: 'destructive',
    });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex justify-between items-center h-20 px-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
            <KarnatakaMapIcon className="w-10 h-10" />
            <h1>Karnataka News Pulse</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 text-center bg-card/50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline text-primary mb-4">
              Your Finger on the Pulse of Karnataka
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The only platform you need for real-time, district-wise news updates, powered by AI insights.
            </p>
            <Button asChild size="lg">
              <Link href="/register">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center p-6 bg-card rounded-lg shadow-md">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community News Section */}
        {(isUserNewsLoading || userNews.length > 0) && (
            <section id="community-news" className="py-20 bg-card/50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-2">
                    <Users />
                    Community News
                </h2>
                <div
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                   onClick={handleNewsClick}
                >
                  {isUserNewsLoading
                    ? [...Array(4)].map((_, i) => <NewsSkeleton key={i} />)
                    : userNews.map((article) => (
                        <div key={article.id} className="cursor-pointer">
                          <NewsCard article={article} />
                        </div>
                      ))}
                </div>
              </div>
            </section>
        )}

        {/* Latest News Section */}
        <section id="latest-news" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Latest News Headlines</h2>
            <div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              onClick={handleNewsClick}
            >
              {isLatestLoading
                ? [...Array(4)].map((_, i) => <NewsSkeleton key={i} />)
                : latestNews.map((article) => (
                    <div key={article.id} className="cursor-pointer">
                      <NewsCard article={article} />
                    </div>
                  ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild variant="outline">
                    <Link href="/login">View More News</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>

       <footer className="py-8 border-t border-border">
          <div className="container mx-auto text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Karnataka News Pulse. All rights reserved.</p>
          </div>
       </footer>
    </div>
  );
}