// src/components/news/news-skeleton.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function NewsSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <Skeleton className="w-full h-48 mb-4 rounded-t-lg" />
        <Skeleton className="h-6 w-4/5 mb-2" />
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
         <div className="flex items-center justify-between w-full">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex w-full gap-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </CardFooter>
    </Card>
  );
}
