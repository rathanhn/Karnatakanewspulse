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

const data = [
  { name: '30', total: Math.floor(Math.random() * 60) + 10 },
  { name: '16', total: Math.floor(Math.random() * 60) + 10 },
  { name: '28', total: Math.floor(Math.random() * 60) + 10 },
  { name: '24', total: Math.floor(Math.random() * 60) + 10 },
  { name: 'A6', total: Math.floor(Math.random() * 60) + 10 },
  { name: '22', total: Math.floor(Math.random() * 60) + 10 },
  { name: '28', total: Math.floor(Math.random() * 60) + 10 },
  { name: '42', total: Math.floor(Math.random() * 60) + 10 },
  { name: '30', total: Math.floor(Math.random() * 60) + 10 },
  { name: '16', total: Math.floor(Math.random() * 60) + 10 },
  { name: '28', total: Math.floor(Math.random() * 60) + 10 },
];

export function ArticlesOverTimeChart() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Articles Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pl-2">
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
      </CardContent>
    </Card>
  );
}
