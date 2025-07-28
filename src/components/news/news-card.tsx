// src/components/news/news-card.tsx
'use client';

import { useState } from 'react';
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
import { NewsArticle } from '@/lib/data';
import {
  DailyHuntIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/icons';
import { ExternalLink, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type NewsCardProps = {
  article: NewsArticle;
};

const SourceIcon = ({ source, className }: { source: NewsArticle['source'], className?: string }) => {
  const props = { className: className || 'w-6 h-6' };
  switch (source) {
    case 'DailyHunt':
      return <DailyHuntIcon {...props} />;
    case 'Facebook':
      return <FacebookIcon {...props} />;
    case 'X':
      return <XIcon {...props} />;
    case 'YouTube':
      return <YouTubeIcon {...props} />;
    default:
      return null;
  }
};

export function NewsCard({ article }: NewsCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(article.timestamp));

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-card border-accent/20">
        <CardHeader>
           <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden">
             <Image
                src={`https://placehold.co/600x400.png`}
                alt={article.headline}
                data-ai-hint={article['data-ai-hint'] || 'news event'}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
            />
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
            <SourceIcon source={article.source} />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.content}
          </p>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
           <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <Badge variant="outline">{article.district}</Badge>
            <span>{formattedDate}</span>
          </div>
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsDialogOpen(true)}
            >
              <BookOpen />
              Read More
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                View Source
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
                 <DialogTitle className="text-2xl font-bold font-headline text-primary">
                    {article.headline}
                 </DialogTitle>
                 <SourceIcon source={article.source} className="w-8 h-8"/>
            </div>
            <DialogDescription asChild>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Badge variant="default">{article.district}</Badge>
                    <span>{formattedDate}</span>
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
            ) : (
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                    <Image
                        src={`https://placehold.co/800x400.png`}
                        alt={article.headline}
                        data-ai-hint={article['data-ai-hint'] || 'news event'}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            )}
            <ScrollArea className="h-60 mt-4 pr-4">
              <p className="text-base text-foreground whitespace-pre-wrap">{article.content}</p>
            </ScrollArea>
          </div>
           <div className="flex justify-end gap-2 mt-4">
             <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Close</Button>
             <Button asChild>
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
