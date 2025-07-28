// src/components/dashboard/top-districts-chart.tsx
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
  { name: 'Dharwad', total: Math.floor(Math.random() * 200) + 50 },
  { name: 'Kalaburagi', total: Math.floor(Math.random() * 300) + 100 },
  { name: 'Belagavi', total: Math.floor(Math.random() * 400) + 150 },
  { name: 'Mysuru', total: Math.floor(Math.random() * 500) + 200 },
  { name: 'Bengaluru Urban', total: Math.floor(Math.random() * 600) + 250 },
].sort((a,b) => a.total - b.total);

export function TopDistrictsChart() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Top Districts by Articles</CardTitle>
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
              width={100}
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
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
