'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, TrendingUp, DollarSign, Calendar, Search, Loader2 } from 'lucide-react';
import PriceChart from './components/PriceChart';
import ForecastChart from './components/ForecastChart';
import LocationSelector from './components/LocationSelector';
import StatsCard from './components/StatsCard';

interface HousingData {
  location: string;
  past_data: Array<{
    Date: string;
    Price: number;
  }>;
  forecasted_prices: Array<{
    Date: string;
    PredictedPrice: number;
  }>;
}

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [housingData, setHousingData] = useState<HousingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchHousingData = async (location: string) => {
    if (!location) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/housing_data?location=${encodeURIComponent(location)}`);
      setHousingData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch housing data');
      setHousingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchHousingData(selectedLocation);
    }
  }, [selectedLocation]);

  const calculateStats = () => {
    if (!housingData) return null;

    const pastPrices = housingData.past_data.map(d => d.Price);
    const forecastPrices = housingData.forecasted_prices.map(d => d.PredictedPrice);
    
    const currentPrice = pastPrices[pastPrices.length - 1];
    const predictedPrice = forecastPrices[forecastPrices.length - 1];
    const priceChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    const avgPrice = pastPrices.reduce((a, b) => a + b, 0) / pastPrices.length;
    const maxPrice = Math.max(...pastPrices);
    const minPrice = Math.min(...pastPrices);

    return {
      currentPrice,
      predictedPrice,
      priceChange,
      avgPrice,
      maxPrice,
      minPrice
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Home className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Housing Price Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LocationSelector 
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Search className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading housing data...</span>
          </div>
        )}

        {housingData && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Current Price"
                value={`$${stats.currentPrice.toLocaleString()}`}
                icon={DollarSign}
                trend="neutral"
              />
              <StatsCard
                title="Predicted Price"
                value={`$${stats.predictedPrice.toLocaleString()}`}
                icon={TrendingUp}
                trend={stats.priceChange > 0 ? "up" : "down"}
                change={`${stats.priceChange > 0 ? '+' : ''}${stats.priceChange.toFixed(1)}%`}
              />
              <StatsCard
                title="Average Price"
                value={`$${stats.avgPrice.toLocaleString()}`}
                icon={DollarSign}
                trend="neutral"
              />
              <StatsCard
                title="Price Range"
                value={`$${stats.minPrice.toLocaleString()} - $${stats.maxPrice.toLocaleString()}`}
                icon={TrendingUp}
                trend="neutral"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Historical Prices</h2>
                <PriceChart data={housingData.past_data} />
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Forecast</h2>
                <ForecastChart 
                  pastData={housingData.past_data}
                  forecastData={housingData.forecasted_prices}
                />
              </div>
            </div>

            {/* Combined Chart */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Price History & Forecast</h2>
              <ForecastChart 
                pastData={housingData.past_data}
                forecastData={housingData.forecasted_prices}
                showCombined={true}
              />
            </div>
          </>
        )}

        {!loading && !housingData && !error && (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No location selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a location above to view housing price data and forecasts.
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 