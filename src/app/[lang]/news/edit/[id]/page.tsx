// src/app/news/edit/[id]/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { karnatakaDistricts, getNewsArticleById, updateUserNews, NewsArticle, newsCategories, Category } from '@/lib/data';
import { ArrowLeft, Send } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const userSelectableCategories = newsCategories.filter(c => c !== 'Trending' && c !== 'User Submitted');

export default function EditNewsPage({ params }: { params: { id: string, lang: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const id = params.id as string;
    
    const [user, setUser] = useState<User | null>(null);
    const [post, setPost] = useState<NewsArticle | null>(null);
    const [headline, setHeadline] = useState('');
    const [content, setContent] = useState('');
    const [district, setDistrict] = useState('');
    const [category, setCategory] = useState<Category | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push(`/${params.lang}/login`);
            }
        });
        return () => unsubscribe();
    }, [router, params.lang]);

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            setIsLoading(true);
            try {
                const fetchedPost = await getNewsArticleById(id);
                if (fetchedPost) {
                    if(user && fetchedPost.userId !== user.uid) {
                        setError("You are not authorized to edit this post.");
                        toast({ title: "Unauthorized", description: "You can only edit your own posts.", variant: "destructive"});
                        router.push(`/${params.lang}/home/my-posts`);
                        return;
                    }
                    setPost(fetchedPost);
                    setHeadline(fetchedPost.headline);
                    setContent(fetchedPost.content || '');
                    setDistrict(fetchedPost.district);
                    setCategory(fetchedPost.category);
                } else {
                    setError("Post not found.");
                     toast({ title: "Error", description: "The requested post could not be found.", variant: "destructive"});
                }
            } catch (err) {
                setError("Failed to fetch post.");
                 toast({ title: "Error", description: "There was a problem fetching your post.", variant: "destructive"});
            } finally {
                setIsLoading(false);
            }
        };

        // We fetch the post only when we have the user, to perform the auth check
        if (user) {
           fetchPost();
        }

    }, [id, user, router, toast, params.lang]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!headline || !content || !district || !category) {
            toast({ title: 'Missing fields', description: 'Please fill out all fields.', variant: 'destructive'});
            return;
        }

        setIsSubmitting(true);
        try {
            await updateUserNews(id, { headline, content, district, category });
            toast({ title: 'Post Updated!', description: 'Your changes have been saved successfully.'});
            router.push(`/${params.lang}/home/my-posts`);
        } catch (error) {
            toast({ title: 'Update Failed', description: 'Could not save your changes.', variant: 'destructive'});
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return (
             <div className="flex justify-center items-center min-h-screen">
                <p>Loading post...</p>
            </div>
        )
    }

    if (error) {
         return (
             <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <p className='text-destructive text-xl mb-4'>{error}</p>
                <Button asChild>
                    <Link href={`/${params.lang}/home/my-posts`}>Go Back</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link href={`/${params.lang}/home`} className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <Button asChild variant="ghost">
                        <Link href={`/${params.lang}/home/my-posts`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to My Posts
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Edit News Post</CardTitle>
                        <CardDescription>Make changes to your published article.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="headline">Headline</Label>
                                <Input
                                    id="headline"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder="Enter a catchy headline"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="district">District</Label>
                                    <Select onValueChange={setDistrict} value={district} required disabled={isSubmitting}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the relevant district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {karnatakaDistricts.filter(d => d !== 'Karnataka').map(d => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                     <Label htmlFor="category">Category</Label>
                                    <Select onValueChange={(value) => setCategory(value as Category)} value={category} required disabled={isSubmitting}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a news category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {userSelectableCategories.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write the full news story here..."
                                    required
                                    rows={10}
                                    disabled={isSubmitting}
                                />
                            </div>
                           
                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                <Send className="mr-2"/>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
