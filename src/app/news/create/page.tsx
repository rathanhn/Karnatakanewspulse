// src/app/news/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { karnatakaDistricts, addUserNews } from '@/lib/data';
import { ArrowLeft, Send } from 'lucide-react';
import { KarnatakaMapIcon } from '@/components/icons';


export default function CreateNewsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [headline, setHeadline] = useState('');
    const [content, setContent] = useState('');
    const [district, setDistrict] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!headline || !content || !district) {
            toast({
                title: 'Missing fields',
                description: 'Please fill out all fields to submit the news.',
                variant: 'destructive',
            });
            return;
        }

        addUserNews({
            headline,
            content,
            district,
            imageUrl: null // User image uploads can be added later
        });

        toast({
            title: 'News Submitted!',
            description: 'Thank you for your contribution. Your news is now live.',
        });

        // Redirect to the news feed for that district
        router.push(`/news?district=${district}&category=User%20Submitted`);
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-primary font-headline">
                        <KarnatakaMapIcon className="w-10 h-10" />
                        <h1>Karnataka News Pulse</h1>
                    </Link>
                    <Button asChild variant="ghost">
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Create a News Post</CardTitle>
                        <CardDescription>Share a local news story with the community.</CardDescription>
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
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="district">District</Label>
                                <Select onValueChange={setDistrict} value={district} required>
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
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write the full news story here..."
                                    required
                                    rows={10}
                                />
                            </div>
                           
                            <Button type="submit" className="w-full" size="lg">
                                <Send className="mr-2"/>
                                Publish News
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
