// src/components/news/news-card.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { NewsArticle, UserProfile, getUserProfile } from '@/lib/data';
import {
  DailyHuntIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
  NewsIcon,
} from '@/components/icons';
import { ExternalLink, BookOpen, UserCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type NewsCardProps = {
  article: NewsArticle;
  priority?: boolean;
};

const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
}


const SourceDisplay = ({ article, className }: { article: NewsArticle, className?: string }) => {
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (article.userId) {
        const profile = await getUserProfile(article.userId);
        setAuthorProfile(profile);
      }
    };
    fetchAuthor();
  }, [article.userId]);

  if (article.source === 'User Submitted') {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="w-6 h-6">
            <AvatarImage src={authorProfile?.photoURL || ''} />
            <AvatarFallback>{getInitials(authorProfile?.displayName)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{authorProfile?.displayName || 'Community Contributor'}</span>
      </div>
    );
  }

  const props = { className: className || 'w-6 h-6' };
  const lowerSource = article.source.toLowerCase();
  if (lowerSource.includes('dailyhunt')) return <DailyHuntIcon {...props} />;
  if (lowerSource.includes('facebook')) return <FacebookIcon {...props} />;
  if (lowerSource.includes('twitter') || lowerSource.includes('x.com')) return <XIcon {...props} />;
  if (lowerSource.includes('youtube')) return <YouTubeIcon {...props} />;
  return <NewsIcon {...props} />;
};


export function NewsCard({ article, priority = false }: NewsCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (article.timestamp) {
        setFormattedDate(
            new Intl.DateTimeFormat('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(article.timestamp))
        );
    }
  }, [article.timestamp]);


  const imageUrl = article.imageUrl;

  return (
    <>
      <Card className="flex flex-col h-full md:h-auto snap-start md:snap-align-none md:rounded-lg overflow-hidden transition-all duration-300 ease-in-out md:hover:shadow-xl md:hover:-translate-y-1 bg-card md:border-accent/20">
        {/* Mobile Reel View */}
        <div className="md:hidden flex flex-col h-screen-minus-header p-4 bg-black/30 backdrop-blur-sm">
            <div className="relative w-full h-1/2 rounded-lg overflow-hidden flex-shrink-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={article.headline}
                        data-ai-hint={article['data-ai-hint'] || 'news event'}
                        fill
                        sizes="100vw"
                        priority={priority}
                        className="object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-secondary text-center p-4">
                        <h3 className="font-bold text-lg text-secondary-foreground">{article.headline}</h3>
                    </div>
                )}
                {article.embedUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <YouTubeIcon className="w-16 h-16 text-white opacity-80" />
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-grow justify-between pt-4 overflow-y-auto">
                 <CardHeader className="p-0">
                    <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-2xl font-bold leading-tight font-headline text-primary">
                        {article.headline}
                        </CardTitle>
                        {article.source !== 'User Submitted' && <SourceDisplay article={article} />}
                    </div>
                 </CardHeader>
                <CardContent className="p-0 mt-2 flex-grow">
                    <p className="text-base text-muted-foreground line-clamp-5">
                        {article.content}
                    </p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4 p-0 mt-4">
                    {article.source === 'User Submitted' && (
                        <div className="w-full">
                            <SourceDisplay article={article} />
                        </div>
                    )}
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                    <Badge variant="outline">{article.district}</Badge>
                    <span>{formattedDate || '...'}</span>
                </div>
                <div className="flex w-full gap-2">
                    <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={!article.content}
                    >
                    <BookOpen />
                    Read More
                    </Button>
                    <Button asChild variant="outline" className="w-full" disabled={article.url === '#'}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink />
                        View Source
                    </a>
                    </Button>
                </div>
                </CardFooter>
            </div>
        </div>

        {/* Desktop Card View */}
        <div className="hidden md:flex flex-col h-full">
            <CardHeader>
            <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={article.headline}
                        data-ai-hint={article['data-ai-hint'] || 'news event'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={priority}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400.png'; e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-secondary text-center p-4">
                        <h3 className="font-bold text-lg text-secondary-foreground">{article.headline}</h3>
                    </div>
                )}
                {article.embedUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <YouTubeIcon className="w-16 h-16 text-white opacity-80" />
                    </div>
                )}
            </div>
            <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg font-bold leading-snug font-headline text-primary">
                {article.headline}
                </CardTitle>
                {article.source !== 'User Submitted' && <SourceDisplay article={article} />}
            </div>
            </CardHeader>
            <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
                {article.content}
            </p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                {article.source === 'User Submitted' && (
                    <div className="w-full">
                        <SourceDisplay article={article} />
                    </div>
                )}
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                <Badge variant="outline">{article.district}</Badge>
                <span>{formattedDate || '...'}</span>
            </div>
            <div className="flex w-full gap-2">
                <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsDialogOpen(true)}
                disabled={!article.content}
                >
                <BookOpen />
                Read More
                </Button>
                <Button asChild variant="outline" className="w-full" disabled={article.url === '#'}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    View Source
                </a>
                </Button>
            </div>
            </CardFooter>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
                 <DialogTitle className="text-2xl font-bold font-headline text-primary">
                    {article.headline}
                 </DialogTitle>
                 <SourceDisplay article={article} />
            </div>
            <DialogDescription asChild>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Badge variant="default">{article.district}</Badge>
                    <span>{formattedDate || '...'}</span>
                </div>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {article.embedUrl ? (
                <div className="aspect-video w-full">
                    <iframe
                        width="100%"
                        height="100%"
                        src={article.embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                    ></iframe>
                </div>
            ) : imageUrl ? (
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={article.headline}
                        data-ai-hint={article['data-ai-hint'] || 'news event'}
                        fill
                        sizes="80vw"
                        className="object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x400.png'; }}
                    />
                </div>
            ) : (
                 <div className="flex items-center justify-center h-64 bg-secondary text-center p-4 mb-4 rounded-lg">
                    <h3 className="font-bold text-2xl text-secondary-foreground">{article.headline}</h3>
                </div>
            )}
            <ScrollArea className="h-60 mt-4 pr-4">
              <p className="text-base text-foreground whitespace-pre-wrap">{article.content}</p>
            </ScrollArea>
          </div>
           <div className="flex justify-end gap-2 mt-4">
             <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Close</Button>
             <Button asChild disabled={article.url === '#'}>
               <a href={article.url} target="_blank" rel="noopener noreferrer">
                 <ExternalLink />
                 View Source
               </a>
             </Button>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
