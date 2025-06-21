'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
  change?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, change }: StatsCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend === 'up' ? 'text-green-600' : 
                    trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {trend === 'up' && <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />}
                    {trend === 'down' && <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />}
                    <span className="ml-1">{change}</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 