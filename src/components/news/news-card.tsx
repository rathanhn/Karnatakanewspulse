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
import { NewsArticle } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  DailyHuntIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
  NewsIcon,
} from '@/components/icons';
import { ExternalLink, BookOpen, Share2, Star, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getDictionary, Dictionary } from '@/lib/i18n';
import { translateText } from '@/ai/flows/translate-text';


type NewsCardProps = {
  article: NewsArticle;
  priority?: boolean;
  isMyPost?: boolean;
  lang?: 'en' | 'kn';
};

const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const SourceDisplay = ({ article, className, dict }: { article: NewsArticle, className?: string, dict: Dictionary }) => {
  const props = { className: className || 'w-6 h-6' };

  if (article.source === 'User Submitted' && article.author) {
      const author = article.author;
      const authorName = author.displayName || dict.communityContributor;
      const authorImage = author.photoURL || '';
      const authorInitials = getInitials(authorName);

      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
              <AvatarImage src={authorImage} alt={authorName}/>
              <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{authorName}</span>
        </div>
      );
  }

  if (article.source === 'User Submitted') {
     return (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
              <AvatarFallback>CC</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{dict.communityContributor}</span>
        </div>
      );
  }

  // Logic for API-sourced articles
  const lowerSource = article.source.toLowerCase();
  if (lowerSource.includes('dailyhunt')) return <DailyHuntIcon {...props} />;
  if (lowerSource.includes('facebook')) return <FacebookIcon {...props} />;
  if (lowerSource.includes('twitter') || lowerSource.includes('x.com')) return <XIcon {...props} />;
  if (lowerSource.includes('youtube')) return <YouTubeIcon {...props} />;
  return <NewsIcon {...props} />;
};


export function NewsCard({ article, priority = false, isMyPost = false, lang = 'en' }: NewsCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const { toast } = useToast();
  const dict = getDictionary(lang);

  const [translatedHeadline, setTranslatedHeadline] = useState(article.headline);
  const [translatedContent, setTranslatedContent] = useState(article.content);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (lang === 'kn' && article.headline) {
        const doTranslate = async () => {
            setIsTranslating(true);
            try {
                const [headlineRes, contentRes] = await Promise.all([
                    translateText({ text: article.headline, targetLanguage: 'kn'}),
                    translateText({ text: article.content || '', targetLanguage: 'kn'})
                ]);
                setTranslatedHeadline(headlineRes.translatedText);
                setTranslatedContent(contentRes.translatedText);
            } catch (error) {
                console.error("Translation failed:", error);
                // Fallback to original text if translation fails
                setTranslatedHeadline(article.headline);
                setTranslatedContent(article.content);
            } finally {
                setIsTranslating(false);
            }
        };
        doTranslate();
    } else {
        setTranslatedHeadline(article.headline);
        setTranslatedContent(article.content);
    }
  }, [lang, article.headline, article.content]);


  useEffect(() => {
    if (article.timestamp) {
        if (typeof article.timestamp.toDate === 'function') {
            setFormattedDate(
                new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                .format(article.timestamp.toDate())
            );
        } else {
            setFormattedDate(
                new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                .format(new Date(article.timestamp))
            );
        }
    }
  }, [article.timestamp]);

  const handleShare = async () => {
    const urlToShare = (article.source === 'User Submitted' && typeof window !== 'undefined') 
        ? `${window.location.origin}/${lang}/news/post/${article.id}` 
        : article.url;

    if (navigator.share) {
      try {
        await navigator.share({
          title: translatedHeadline,
          text: (translatedContent || '').substring(0, 100) + '...',
          url: urlToShare,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
        navigator.clipboard.writeText(urlToShare);
        toast({ title: dict.linkCopied, description: dict.linkCopiedDesc });
    }
  };


  const imageUrl = article.imageUrl;
  
  const headlineToShow = isTranslating ? <div className='flex items-center gap-2'><Loader2 className='animate-spin w-5 h-5'/> Translating...</div> : translatedHeadline;
  const contentToShow = isTranslating ? '...' : translatedContent;

  return (
    <>
      <Card className={cn("flex flex-col h-full md:h-auto snap-start md:snap-align-none md:rounded-lg overflow-hidden transition-all duration-300 ease-in-out md:hover:shadow-xl md:hover:-translate-y-1 bg-card md:border-accent/20", isMyPost && 'border-primary border-2')}>
        {isMyPost && (
            <Badge variant="default" className="absolute top-2 right-2 z-10 bg-primary/80">
              <Star className="mr-1 h-3 w-3" />
              {dict.myPost}
            </Badge>
        )}
        {/* Mobile Reel View */}
        <div className="md:hidden flex flex-col h-screen-minus-header p-4 bg-black/30 backdrop-blur-sm relative">
             {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={article.headline}
                        data-ai-hint={article['data-ai-hint'] || 'news event'}
                        fill
                        sizes="100vw"
                        priority={priority}
                        className="object-cover -z-10"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                )}
            <div className="relative w-full h-1/2 rounded-lg overflow-hidden flex-shrink-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={article.headline}
                        data-ai-hint={article['data-ai-hint'] || 'news event'}
                        fill
                        sizes="100vw"
                        priority={priority}
                        className="object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-secondary text-center p-4">
                        <h3 className="font-bold text-lg text-secondary-foreground">{headlineToShow}</h3>
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
                        {headlineToShow}
                        </CardTitle>
                        <SourceDisplay article={article} dict={dict} />
                    </div>
                 </CardHeader>
                <CardContent className="p-0 mt-2 flex-grow">
                    <p className="text-base text-muted-foreground line-clamp-5">
                        {contentToShow}
                    </p>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4 p-0 mt-4">
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
                    {dict.readMore}
                    </Button>
                     <Button variant="outline" className="w-full" onClick={handleShare}>
                        <Share2 />
                        {dict.share}
                    </Button>
                </div>
                 <Button asChild variant="outline" className="w-full" disabled={article.url === '#'}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink />
                        {dict.viewSource}
                    </a>
                </Button>
                </CardFooter>
            </div>
        </div>

        {/* Desktop Card View */}
        <div className="hidden md:flex flex-col h-full">
             <div className="relative w-full h-48 mb-4 rounded-t-lg overflow-hidden group">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={article.headline}
                        data-ai-hint={article['data-ai-hint'] || 'news event'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={priority}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-secondary text-center p-4">
                        <h3 className="font-bold text-lg text-secondary-foreground">{headlineToShow}</h3>
                    </div>
                )}
                {article.embedUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <YouTubeIcon className="w-16 h-16 text-white opacity-80" />
                    </div>
                )}
            </div>
            <CardHeader className='pt-0'>
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg font-bold leading-snug font-headline text-primary">
                    {headlineToShow}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
                {contentToShow}
            </p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                <div className="w-full">
                    <SourceDisplay article={article} dict={dict} />
                </div>
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
                {dict.read}
                </Button>
                 <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 />
                 </Button>
                <Button asChild variant="outline" className="w-full" disabled={article.url === '#'}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    {dict.source}
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
                    {headlineToShow}
                 </DialogTitle>
                 <SourceDisplay article={article} dict={dict} />
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
                        sizes="(max-width: 640px) 90vw, 80vw"
                        className="object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
            ) : (
                 <div className="flex items-center justify-center h-64 bg-secondary text-center p-4 mb-4 rounded-lg">
                    <h3 className="font-bold text-2xl text-secondary-foreground">{headlineToShow}</h3>
                </div>
            )}
            <ScrollArea className="h-60 mt-4 pr-4">
              <p className="text-base text-foreground whitespace-pre-wrap">{contentToShow}</p>
            </ScrollArea>
          </div>
           <div className="flex justify-end gap-2 mt-4">
             <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>{dict.close}</Button>
              <Button onClick={handleShare}><Share2 /> {dict.share}</Button>
             <Button asChild disabled={article.url === '#'}>
               <a href={article.url} target="_blank" rel="noopener noreferrer">
                 <ExternalLink />
                 {dict.viewSource}
               </a>
             </Button>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
