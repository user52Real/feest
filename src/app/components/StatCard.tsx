'use client';

interface StatCardProps {
  title: string;
  value: number;
  trend: number;
  format?: 'number' | 'currency' | 'percentage';
}

export default function StatCard({ title, value, trend, format = 'number' }: StatCardProps) {
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {formatValue(value)}
        </p>
        <p className={`ml-2 flex items-baseline text-sm font-semibold ${
          trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
          {Math.abs(trend).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}