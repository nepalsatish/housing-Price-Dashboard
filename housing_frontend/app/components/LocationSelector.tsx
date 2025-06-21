'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export default function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);
    const [searchedLocations, setSearchedLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
          const response = await fetch('/api/locations');
          const data = await response.json();
        if (Array.isArray(data.locations)) {
            const formattedLocations = data.locations.map((location: any) => ({
                display: `${location.RegionName}, ${location.StateName}`,
                value: location.RegionName
            }));
            
            // Remove duplicates based on value (RegionName)
            const uniqueLocations = formattedLocations.filter((location: { display: string; value: string }, index: number, self: { display: string; value: string }[]) => 
                index === self.findIndex((l: { display: string; value: string }) => l.value === location.value)
            );
            
            setLocations(uniqueLocations);
        } else {
            console.error('Invalid locations data format:', data.locations);
            setLocations([]);
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        // Fallback to empty array if fetch fails
        setLocations([]);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
          }
        }}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <MapPin className="h-4 w-4 text-gray-400" />
        <span>{selectedLocation || 'Select Location'}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search locations..."
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filteredLocations = locations.filter(
                    (location: any) =>
                      location.display.toLowerCase().includes(searchTerm) ||
                      location.value.toLowerCase().includes(searchTerm)
                  );
                  setSearchedLocations(filteredLocations);
                }}
              /> 
            </div>
            {(searchedLocations.length > 0 || locations.length === 0) ? searchedLocations.map((location: any) => (
              <button
                key={location.value}
                onClick={() => {
                  onLocationChange(location.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedLocation === location.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700'
                }`}
              >
                {location.display}
              </button>
            )) : locations.map((location: any) => (
              <button
                key={location.value}
                onClick={() => {
                  onLocationChange(location.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedLocation === location.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700'
                }`}
              >
                {location.display}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}