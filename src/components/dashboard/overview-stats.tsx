// src/components/dashboard/overview-stats.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const stats = [
  { name: 'Total Articles', value: '12,547' },
  { name: 'Active Sources', value: '28' },
  { name: 'Categories', value: '10' },
  { name: 'Today\'s Articles', value: '186' },
];

export function OverviewStats() {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
