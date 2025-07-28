// src/app/dashboard/page.tsx
'use client';

import { ArticlesByCategoryChart } from '@/components/dashboard/articles-by-category-chart';
import { ArticlesBySourceChart } from '@/components/dashboard/articles-by-source-chart';
import { ArticlesOverTimeChart } from '@/components/dashboard/articles-over-time-chart';
import { KarnatakaMapChart } from '@/components/dashboard/karnataka-map-chart';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { TopDistrictsChart } from '@/components/dashboard/top-districts-chart';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">
            Karnataka District-wise News Pulse
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="container mx-auto flex-1 space-y-8 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewStats />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <KarnatakaMapChart />
          <TopDistrictsChart />
          <ArticlesByCategoryChart />
          <ArticlesBySourceChart />
          <ArticlesOverTimeChart />
        </div>
      </main>
    </div>
  );
}
