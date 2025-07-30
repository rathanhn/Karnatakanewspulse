// src/components/dashboard/articles-over-time-chart.tsx
'use client';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';


const generateData = () => [
  { name: 'Jan', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Feb', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Mar', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Apr', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'May', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Jun', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Jul', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Aug', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Sep', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Oct', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Nov', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'Dec', total: Math.floor(Math.random() * 60) + 10 },
];


export function ArticlesOverTimeChart() {
  const [isClient, setIsClient] = useState(false);
  const data = useMemo(() => generateData(), []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Articles Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pl-2">
       {isClient ? (
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5}/>
                <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
                />
                <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                    r: 4,
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2
                }}
                />
            </LineChart>
            </ResponsiveContainer>
       ) : (
            <Skeleton className="w-full h-full" />
       )}
      </CardContent>
    </Card>
  );
}
