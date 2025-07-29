// src/app/home/my-posts/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { NewsArticle, getUserNewsFromFirestore, deleteUserNews } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';

function PostCard({ post, onDelete }: { post: NewsArticle, onDelete: (id: string) => void }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUserNews(post.id);
            toast({ title: "Post Deleted", description: "Your news post has been successfully removed." });
            onDelete(post.id); // Notify parent to remove from state
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
        } finally {
            setIsDeleting(false);
        }
    };

    const formattedDate = new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(post.timestamp));

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{post.headline}</CardTitle>
                    <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardDescription>
                    {post.district} - Published on {formattedDate}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/news/edit/${post.id}`}>
                        <Edit className="mr-2" />
                        Edit
                    </Link>
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isDeleting}>
                            <Trash2 className="mr-2" />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your post.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}


export default function MyPostsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchPosts = useCallback(async (uid: string) => {
        setIsLoading(true);
        try {
            const userPosts = await getUserNewsFromFirestore(uid);
            setPosts(userPosts);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch your posts.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    useEffect(() => {
        if (user) {
            fetchPosts(user.uid);
        }
    }, [user, fetchPosts]);

    const handlePostDeletion = (deletedPostId: string) => {
        setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link href="/home" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <Button asChild variant="ghost">
                        <Link href="/home">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold font-headline">My Published Posts</h2>
                    <Button asChild>
                        <Link href="/news/create">
                            <PlusCircle className="mr-2"/>
                            Create New Post
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <div className="h-6 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                    <div className="h-10 w-24 bg-muted rounded"></div>
                                    <div className="h-10 w-24 bg-muted rounded"></div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">No posts yet!</h3>
                        <p className="text-muted-foreground mt-2">Click "Create New Post" to share your first story.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} onDelete={handlePostDeletion}/>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
