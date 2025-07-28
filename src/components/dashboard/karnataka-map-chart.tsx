// src/components/dashboard/karnataka-map-chart.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// This is a placeholder component.
// In a real application, you would use a library like D3.js or a mapping library
// to render an interactive map of Karnataka.
const KarnatakaMapPlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted/20 p-4">
    <svg
      viewBox="0 0 200 150"
      className="max-h-full w-auto"
      fill="none"
      stroke="hsl(var(--foreground))"
      strokeWidth="1"
    >
      <path d="M40.8,11.3 C30.6,15.7,19.3,27.1,14.7,38.9 C7,59,10,80.7,18.5,100.2 C27,119.7,41.9,132.3,61.1,137.9 C80.3,143.5,101.9,141.2,120.5,133.3 C139.1,125.4,153.1,111.4,162,94.2 C170.9,77,175.7,56,171.5,37.3 C167.3,18.6,154.5,4.7,136.7,2.3 C118.9,-0.1,98.6,5,81.8,11.3 C65,17.6,49.8,11.3,40.8,11.3 Z"
       className="fill-green-400 opacity-50" />
      <path d="M60,95 C75,110,100,115,120,105 C140,95,155,75,150,55 C145,35,125,25,105,35 C85,45,70,60,60,70 C50,80,50,85,60,95Z"
        className="fill-orange-400 opacity-60" />
      <text x="100" y="75" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12">Map</text>
    </svg>
  </div>
);


export function KarnatakaMapChart() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Top Districts by Articles</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <KarnatakaMapPlaceholder />
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <span>Low</span>
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-green-400 to-orange-400"></div>
          <span>High</span>
        </div>
      </CardContent>
    </Card>
  );
}
