
// src/app/admin/page.tsx
'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UserProfile, getUserProfile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Home, Shield } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { ArticlesOverTimeChart } from '@/components/dashboard/articles-over-time-chart';
import { TopDistrictsChart } from '@/components/dashboard/top-districts-chart';
import { ArticlesByCategoryChart } from '@/components/dashboard/articles-by-category-chart';
import { ArticlesBySourceChart } from '@/components/dashboard/articles-by-source-chart';

export default function AdminPage({ params }: { params: { lang: string } }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const profile = await getUserProfile(currentUser.uid);
                    setUserProfile(profile);
                    if (!profile?.isAdmin) {
                        toast({ title: 'Access Denied', description: 'You do not have permission to view this page.', variant: 'destructive' });
                        router.push(`/${unwrappedParams.lang}/home`);
                    }
                } catch (error) {
                     toast({ title: 'Error', description: 'Could not verify your permissions.', variant: 'destructive' });
                     router.push(`/${unwrappedParams.lang}/home`);
                }
            } else {
                router.push(`/${unwrappedParams.lang}/login`);
            }
        });
        return () => unsubscribe();
    }, [router, toast, unwrappedParams.lang]);
    

    if (!userProfile?.isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <p>Verifying access...</p>
            </div>
        );
    }
    
    return (
         <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link href={`/${unwrappedParams.lang}/home`} className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <div className="flex items-center gap-4">
                         <h2 className="text-xl font-semibold flex items-center gap-2"><Shield /> Admin Dashboard</h2>
                        <Button asChild variant="ghost">
                            <Link href={`/${unwrappedParams.lang}/home`}>
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                   <OverviewStats />
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
                  <ArticlesOverTimeChart />
                  <TopDistrictsChart />
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-7">
                  <ArticlesByCategoryChart />
                  <ArticlesBySourceChart />
                </div>
            </main>
        </div>
    );
}
