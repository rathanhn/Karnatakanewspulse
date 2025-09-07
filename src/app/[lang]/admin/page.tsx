
// src/app/admin/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UserProfile, getUserProfile, getAdminDashboardStats } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, Newspaper, Shield } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';

type AdminStats = {
    totalArticles: number;
    totalUsers: number;
};

export default function AdminPage({ params }: { params: { lang: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const profile = await getUserProfile(currentUser.uid);
                    setUserProfile(profile);
                    if (!profile?.isAdmin) {
                        toast({ title: 'Access Denied', description: 'You do not have permission to view this page.', variant: 'destructive' });
                        router.push(`/${params.lang}/home`);
                    }
                } catch (error) {
                     toast({ title: 'Error', description: 'Could not verify your permissions.', variant: 'destructive' });
                     router.push(`/${params.lang}/home`);
                }
            } else {
                router.push(`/${params.lang}/login`);
            }
        });
        return () => unsubscribe();
    }, [router, toast, params]);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const adminStats = await getAdminDashboardStats();
            setStats(adminStats);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch admin statistics.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        if (userProfile?.isAdmin) {
            fetchStats();
        }
    }, [userProfile, fetchStats]);

    if (!userProfile?.isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Verifying access...</p>
            </div>
        );
    }
    
    return (
         <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link href={`/${params.lang}/home`} className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <div className="flex items-center gap-4">
                         <h2 className="text-xl font-semibold flex items-center gap-2"><Shield /> Admin Dashboard</h2>
                        <Button asChild variant="ghost">
                            <Link href={`/${params.lang}/home`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{isLoading ? '...' : stats?.totalArticles}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{isLoading ? '...' : stats?.totalUsers}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Admin Actions</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="p-4 flex items-center justify-center">
                            <p className="text-muted-foreground">More admin features coming soon...</p>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
