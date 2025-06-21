'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceData {
  Date: string;
  Price: number;
}

interface ForecastData {
  Date: string;
  PredictedPrice: number;
}

interface ForecastChartProps {
  pastData: PriceData[];
  forecastData: ForecastData[];
  showCombined?: boolean;
}

export default function ForecastChart({ pastData, forecastData, showCombined = false }: ForecastChartProps) {
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

  // Prepare data for the chart
  const historicalChartData = pastData.map(item => ({
    date: item.Date,
    formattedDate: formatDate(item.Date),
    historicalPrice: item.Price,
    formattedHistoricalPrice: formatPrice(item.Price)
  }));

  const forecastChartData = forecastData.map(item => ({
    date: item.Date,
    formattedDate: formatDate(item.Date),
    predictedPrice: item.PredictedPrice,
    formattedPredictedPrice: formatPrice(item.PredictedPrice)
  }));

  // For combined view, merge the data
  const combinedData = showCombined ? [
    ...historicalChartData.map(item => ({
      ...item,
      predictedPrice: null
    })),
    ...forecastChartData.map(item => ({
      ...item,
      historicalPrice: null
    }))
  ] : [];

  const chartData = showCombined ? combinedData : forecastChartData;

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
          formatter={(value: number, name: string) => [
            formatPrice(value), 
            name === 'historicalPrice' ? 'Historical Price' : 'Predicted Price'
          ]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        {showCombined && (
          <Legend 
            verticalAlign="top" 
            height={36}
            formatter={(value) => (
              <span style={{ color: '#6b7280', fontSize: '12px' }}>
                {value === 'historicalPrice' ? 'Historical Price' : 'Predicted Price'}
              </span>
            )}
          />
        )}
        
        {showCombined && (
          <Line 
            type="monotone" 
            dataKey="historicalPrice" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            name="historicalPrice"
          />
        )}
        
        <Line 
          type="monotone" 
          dataKey={showCombined ? "predictedPrice" : "predictedPrice"} 
          stroke="#10b981" 
          strokeWidth={2}
          strokeDasharray={showCombined ? "5 5" : "0"}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          name="predictedPrice"
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 