// src/components/dashboard/articles-by-category-chart.tsx
'use client';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMemo, useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

const generateData = () => [
  { name: 'Politics', value: 400, color: '#FF8042' },
  { name: 'Crime', value: 300, color: '#A000A0' },
  { name: 'Technology', value: 250, color: '#00C49F' },
  { name: 'Education', value: 200, color: '#FFBB28' },
  { name: 'Health', value: 180, color: '#0088FE' },
  { name: 'Sports', value: 150, color: '#FF4444' },
];

export function ArticlesByCategoryChart() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const data = useMemo(() => generateData(), []);
  const totalValue = useMemo(() => data.reduce((acc, entry) => acc + entry.value, 0), [data]);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Articles by Category</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {isClient ? (
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                cursor={{ fill: 'hsl(var(--secondary))' }}
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
                />
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                paddingAngle={2}
                dataKey="value"
                >
                {data.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-foreground">
                {`${((data[0].value / totalValue) * 100).toFixed(0)}%`}
                </text>
                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted-foreground" dy="1em">
                Politics
                </text>
            </PieChart>
            </ResponsiveContainer>
        ) : (
            <Skeleton className="w-full h-full" />
        )}
      </CardContent>
    </Card>
  );
}
