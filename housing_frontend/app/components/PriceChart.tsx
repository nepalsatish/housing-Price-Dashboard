'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceData {
  Date: string;
  Price: number;
}

interface PriceChartProps {
  data: PriceData[];
}

export default function PriceChart({ data }: PriceChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
  };

  const formatPrice = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.Date),
    formattedPrice: formatPrice(item.Price)
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="formattedDate" 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatPrice}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value: number) => [formatPrice(value), 'Price']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="Price" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 