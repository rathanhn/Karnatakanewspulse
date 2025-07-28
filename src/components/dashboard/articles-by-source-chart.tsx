// src/components/dashboard/articles-by-source-chart.tsx
'use client';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const data = [
  { name: 'Source I', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Source H', total: Math.floor(Math.random() * 200) + 80 },
  { name: 'Source G', total: Math.floor(Math.random() * 250) + 100 },
  { name: 'Source F', total: Math.floor(Math.random() * 280) + 120 },
  { name: 'Source E', total: Math.floor(Math.random() * 300) + 150 },
  { name: 'Source D', total: Math.floor(Math.random() * 350) + 180 },
  { name: 'Source C', total: Math.floor(Math.random() * 400) + 200 },
  { name: 'Source B', total: Math.floor(Math.random() * 450) + 220 },
  { name: 'Source A', total: Math.floor(Math.random() * 500) + 250 },
].sort((a,b) => a.total - b.total);

export function ArticlesBySourceChart() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Articles by Source</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: -10 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[4, 4, 4, 4]}
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
